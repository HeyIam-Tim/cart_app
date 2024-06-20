import json
from datetime import timedelta
from typing import Union

from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.query import QuerySet
from django.utils import timezone

from cart.models import Cart, Order, Delivery
from cart.services.tasks import send_order_signal_to_telegram, \
    reply_to_telegram_messages_task

from .facade_cart import FacadeCart
from .facade_delivery import FacadeDelivery
from .facade_cart_item import FacadeCartItem
from .facade_history_order import FacadeHistoryOrder

LOGGER = settings.LOGGER


class FacadeOrder():
    """Фасад Заказ."""

    model = Order
    facade_cart = FacadeCart()
    facade_delivery = FacadeDelivery()
    facade_cart_item = FacadeCartItem()
    facade_history_order = FacadeHistoryOrder()

    NEW = 0
    IN_PROCESS = 1
    FINISHED = 2
    CANCELLED = 3
    CANCELLED_RU = 'ОТМЕНЕН'
    PAID = 4

    PAYMENT_PERIOD_HOURS = 24

    def handle_order(self, order_data: dict) -> dict:
        """
            Работает с заказом.
        """

        user = order_data.get('user')
        cart = self.facade_cart.get_cart(user=user)

        order = self._create_order(cart=cart)

        valid_cart_items = self._get_valid_cart_items(
            order_data=order_data,
            cart=cart,
        )

        self._add_cart_items_to_order(
            order=order,
            valid_cart_items=valid_cart_items,
            )

        self.facade_delivery.create_delivery(
            order=order,
            order_data=order_data,
            user_id=user.id,
        )

        self._remove_cart_items_from_cart(
            cart=cart,
            )

        send_order_signal_to_telegram.apply_async(
            args=[order.uuid],
            serializer="json",
            )

        order_data_back = {
            'order_id': order.id,
            'full_order_cost': order.get_full_order_cost,
        }
        return order_data_back

    def get_orders(self, user: User) -> QuerySet:
        """
            Получает заказы.
        """

        orders = self.model.objects.filter(cart__user=user)

        return orders

    def _create_order(self, cart: Cart) -> Order:
        """Создает заказ"""

        order = self.model.objects.create(cart=cart)

        self.facade_history_order.handle_history_order(
            order=order,
            status='NEW',
        )
        return order

    def _add_cart_items_to_order(
            self,
            order: Order,
            valid_cart_items: list,
            ) -> dict:
        """
            Добавляет выбранные позиции корзины в заказ.
        """

        for cart_item in valid_cart_items:
            cart_item.orders.add(order)
            cart_item.save()

        return

    def _remove_cart_items_from_cart(
            self,
            cart: Cart,
            ) -> dict:
        """
            Убирает выбранные позиции из корзины.
        """

        self.facade_cart_item.remove_cart_items_from_cart(
            cart=cart,
        )

        return

    def _get_valid_cart_items(self, order_data: dict, cart: Cart) -> list:
        """Получает позиции заказов с валидными адресами"""

        valid_cart_items = []
        valid_shop_names = order_data.get('valid_shop_names')

        filter_data = {
            'is_selected': True,
            'max_quantity__gte': 1,
        }

        for shop_name_delivery_cost in valid_shop_names:
            shop_name = shop_name_delivery_cost.split('---')[0]

            if order_data.get('web_shop_handler'):
                filter_data.update({'shop__web_shop__site': shop_name})
            if order_data.get('shop_handler'):
                filter_data.update({'shop__name': shop_name})

            cart_items = cart.cart_items.filter(**filter_data)

            valid_cart_items += list(cart_items)

        return valid_cart_items

    def filter_cart_items_for_order(
            self,
            order: Order,
            filter_data: dict,
            ) -> QuerySet:
        """
            Фильтрует позиции корзины для заказа.
        """

        try:
            cart_items = order.cart_items.filter(**filter_data)
        except Exception as ex:
            LOGGER.warning(f'{ex}')
            return QuerySet
        else:
            return cart_items

    def cancell_deliveries_from_order(self, order: Order) -> None:
        """
            Отменяет доставки из заказа.
        """

        for delivery in order.deliveries.all():
            delivery_data = {'delivery_id': delivery.id}
            self.facade_delivery.cancell_delivery(
                delivery_data=delivery_data,
                )
        return None

    def cancell_order(self, order_data: dict) -> str:
        """
            Отменяет заказ.
        """

        order_id = order_data.get('order_id')
        order = self.model.objects.filter(id=int(order_id)).first()
        if order:
            self.change_status_to_cancelled(order=order)
            # self.cancell_deliveries_from_order(order=order)
        return order_id

    def get_order(self, id: str, user: User = None) -> Order:
        """
            Получает заказ по id.
        """

        if user:
            order = self.model.objects.filter(
                id=int(id), cart__user=user, status=self.NEW).first()
            return order

        order = self.model.objects.filter(id=int(id)).first()
        return order

    def check_order_status(self, order_id: int) -> None:
        """
            Проверяет статус заказа.
        """

        delivery_count = Delivery.objects.filter(
            order__id=int(order_id)).count()
        order = self.model.objects.filter(id=int(order_id)).first()
        if order:
            deliveries_in_process = Delivery.objects.filter(
                order__id=int(order_id), status=self.IN_PROCESS).count()
            if delivery_count == deliveries_in_process:
                order.status = self.IN_PROCESS
                order.save()
                return

            deliveries_cancelled = Delivery.objects.filter(
                order__id=int(order_id), status=self.CANCELLED).count()
            if delivery_count == deliveries_cancelled:
                self.change_status_to_cancelled(order=order)
                return

            deliveries_cancelled = Delivery.objects.filter(
                order__id=int(order_id), status__gte=self.FINISHED).count()
            if delivery_count == deliveries_cancelled:
                order.status = self.FINISHED
                order.save()
                return
            # else:
            #     order.status = self.IN_PROCESS
            #     order.save()
                # return
        return

    def check_order_statuses(self, orders: QuerySet) -> None:
        """
            Проверяет статусы заказов.
        """

        for order in orders:
            delivery_count = Delivery.objects.filter(
                order=order).count()
            if order:
                deliveries_in_process = Delivery.objects.filter(
                    order=order, status=self.IN_PROCESS).count()
                if delivery_count == deliveries_in_process:
                    order.status = self.IN_PROCESS
                    order.save()

                deliveries_cancelled = Delivery.objects.filter(
                    order=order, status=self.CANCELLED).count()
                if delivery_count == deliveries_cancelled:
                    self.change_status_to_cancelled(order=order)

                deliveries_finished = Delivery.objects.filter(
                    order=order, status__gte=self.FINISHED).count()
                if delivery_count == deliveries_finished:
                    order.status = self.FINISHED
                    order.save()
                # else:
                #     order.status = self.IN_PROCESS
                #     order.save()
        return

    def get_info_for_cart_receipt(self, order: Order) -> str:
        """
            Подготавливает данные для чека.
        """

        py_cart_item = {}
        py_cart_items = []
        cart_items = order.cart_items.all()
        for cart_item in cart_items:
            py_cart_item['name'] = cart_item.product_name
            py_cart_item['price'] = cart_item.price
            py_cart_item['quantity'] = int(cart_item.cart_item_quantity)
            py_cart_item['sum'] = cart_item.get_cost
            py_cart_item['tax'] = 'none'
            py_cart_item['item_type'] = 'goods'
            py_cart_item['payment_type'] = 'prepay'
            py_cart_items.append(py_cart_item)
            py_cart_item = {}

        py_cart_item['name'] = 'Доставка'
        py_cart_item['price'] = order.get_total_delivery_cost
        py_cart_item['quantity'] = 1
        py_cart_item['sum'] = order.get_total_delivery_cost
        py_cart_item['tax'] = 'none'
        py_cart_item['item_type'] = 'service'
        py_cart_item['payment_type'] = 'prepay'
        py_cart_items.append(py_cart_item)
        py_cart_item = {}

        service_fee_position = self.form_service_fee_for_receipt(
            py_cart_item=py_cart_item,
        )
        py_cart_items.append(service_fee_position)

        json_cart_items = json.dumps(py_cart_items)
        return json_cart_items

    def form_service_fee_for_receipt(self, py_cart_item: dict) -> dict:
        """Подготавливает сервисный сбор для чека"""

        py_cart_item['name'] = 'Сервисный сбор'
        py_cart_item['price'] = float(settings.SERVICE_FEE)
        py_cart_item['quantity'] = 1
        py_cart_item['sum'] = float(settings.SERVICE_FEE)
        py_cart_item['tax'] = 'none'
        py_cart_item['item_type'] = 'service'
        py_cart_item['payment_type'] = 'prepay'

        return py_cart_item

    def set_status_to_paid(self, order: Order) -> None:
        """
            Устанавливает статус ОПЛАЧЕН.
        """

        order.status = self.PAID
        order.save()

        self.facade_history_order.handle_history_order(
            order=order,
            status='PAID',
        )

        self.add_history_point_in_process(order=order)

        return

    def add_history_point_in_process(self, order: Order) -> None:
        """Добавляет пункт истории "Начало отгрузки" """

        history_order = self.facade_history_order.handle_history_order(
            order=order,
            status='IN_PROCESS',
        )

        IN_PROCESS_STARTS_IN = 10
        history_order.created = history_order.created + timedelta(
            seconds=IN_PROCESS_STARTS_IN,
        )
        history_order.save()
        return

    def can_be_cancelled(self, order: Order) -> bool:
        """Проверяет можно ли отменить заказ"""

        time_for_order_cancellation = order.created + timedelta(
            hours=order.CANCELL_PERIOD_HOURS,
        )

        if order.status == self.CANCELLED:
            return False
        elif timezone.now() > time_for_order_cancellation:
            return False
        return True

    def check_payment_periods_expired(self, orders: list) -> list:
        """Проверяет истек ли срок для оплаты для заказов"""

        checked_orders = []
        orders_generator = (item for item in orders)
        for order in orders_generator:
            is_payment_period_expired = self.check_payment_period_expired(order=order)
            if order.status == self.NEW and is_payment_period_expired:
                self.change_status_to_cancelled(order=order)
            checked_orders.append(order)
        return checked_orders

    def check_payment_period_expired(self, order: Order) -> bool:
        """Проверяет истек ли срок для оплаты для одного заказа"""

        payment_period_expired_to = order.created + timedelta(
            hours=self.PAYMENT_PERIOD_HOURS)

        if timezone.now() > payment_period_expired_to:
            is_payment_period_expired = True
        else:
            is_payment_period_expired = False
        return is_payment_period_expired

    def change_status_to_cancelled(self, order: Order) -> None:
        """Устнанавливает статус Отменен"""

        order.status = self.CANCELLED
        order.save()

        self.facade_history_order.handle_history_order(
            order=order,
            status='CANCELLED',
        )

        self.facade_delivery.handle_cancellation_bulk(
            deliveries_to_cancell=order.deliveries.all(),
        )

        reply_to_telegram_messages_task.apply_async(
            args=[order.uuid, self.CANCELLED_RU],
            serializer="json",
        )
        return

    def get_order_by_order_uuid(self, order_uuid: str) -> Union[Order, None]:
        """Получает заказ по уникальному ключу"""

        order = Order.objects.filter(uuid=str(order_uuid)).first()
        if not order:
            LOGGER.warning(f'NO ORDER WITH order_uuid: {order_uuid}')
            return None
        return order

    def save_telegram_messages(self, telegram_messages: list, order: Order) -> None:
        """Сохраняет телеграм сообщения"""

        order.clean_telegram_messages = telegram_messages
        order.save()
        return None

    def add_paykeeper_id(self, order: Order, paykeeper_id: int) -> None:
        """Сохраняет id Paykeeper"""

        order.paykeeper_id = paykeeper_id
        order.save()
        return None
