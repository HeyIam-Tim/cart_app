from datetime import timedelta
from enum import Enum
from typing import Union
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.query import QuerySet
import requests
import time
import locale
from datetime import datetime
from django.utils import timezone

from cart.models import Delivery, Order
from .facade_cart_item import FacadeCartItem
from .facade_recipient_data import FacadeRecipientData
from cart.services.schemas import StatusDeliverySchema, DeliveryTimeSchema, \
    StatusDeliveryListSchema
# from cart.services.tasks import task_delivery_cancellation_to_telegram

LOGGER = settings.LOGGER


class StatusEnum(Enum):
    """Список статусов для доставки | Enum."""

    NEW = (0, 'Новый')
    IN_PROCESS = (1, 'В пути')
    DELIVERED = (2, 'Доставлен')
    CANCELLED = (3, 'Отменен')

    def get_status_str(status: int) -> str:
        """
            Получает статус и строковое представление статуса.
        """

        for status_enum in StatusEnum:
            if status_enum.value[0] == status:
                return status_enum.value[1]


class DeliveryTypes(Enum):
    """Типы доставок."""

    TYPE_EXPRESS = 'Стоимость доставки---0'
    TYPE_EXPRESS_30MIN_LONGER = 'Экспресс +30 мин---1'
    TYPE_2_HOURS_DELIVERY = 'За 2 часа---2'
    TYPE_PICKUP = f'Самовывоз: свяжитесь с менеджером по номеру {settings.MANAGER_PHONE}---3'

    def get_type_str(description: str) -> str:
        """
            Получает строковое представление типа доставки.
        """

        for type in DeliveryTypes:
            if type.name == f'TYPE_{description.upper()}':
                return type.value


class BaseDelivery():
    """Основной двигатель для достаки."""

    one_price_for_delivery_description = 'Стоимость доставки'

    TYPE_DELIVERY_PICKUP_NAME = 'pickup'

    def deliver():
        pass


class YandexDelivery(BaseDelivery):
    """Яндекс доставка."""

    delivery_info_url = 'https://b2b.taxi.yandex.net/b2b/cargo/integration/v2/claims/info'
    yandex_token = str(settings.YANDEX_TOKEN)
    timeout = 0.2
    status_delivery_list = []
    delivery_types_url = 'https://b2b.taxi.yandex.net/b2b/cargo/integration/v2/offers/calculate'
    delivery_journal_url = 'https://b2b.taxi.yandex.net/b2b/cargo/integration/v2/claims/journal'

    delivery_period_hours_default = settings.DELIVERY_PERIOD_HOURS_DEFAULT

    error_message_address = 'Введен некорректный адрес'
    error_message_delivery_price = 'Доставка расчитана по максимальному тарифу'

    EXPRESS_DELIVERY_TYPE = 'express'

    def deliver():
        pass

    def check_status(
            self,
            data_delivery: dict,
    ) -> Union[StatusDeliveryListSchema, None]:
        """Проверяет статусы доставок."""

        user_id = data_delivery.get('user_id')
        user = User.objects.filter(id=int(user_id)).first()
        if user:
            facade_delivery = FacadeDelivery()
            data_filter = {'order__cart__user__id': int(
                user_id), 'status__lte': 1}
            exclude_filter = {'yandex_delivery_id': ''}

            deliveries = facade_delivery.get_deliveries_query(
                data_filter=data_filter, exclude_filter=exclude_filter)

            self.status_delivery_list = []

            self.request_delivery_info(deliveries=deliveries)

            status_delivery_list_schema = StatusDeliveryListSchema(
                delivery_statuses=self.status_delivery_list)
            return status_delivery_list_schema
        else:
            LOGGER.warning(f'No user with id: {user_id}')
            return

    def request_delivery_info(self, deliveries: QuerySet) -> None:
        """Запросы для получения статусов доставок."""

        for delivery in deliveries:
            if delivery.yandex_delivery_id:
                delivery_info_url = f'{self.delivery_info_url}?claim_id={delivery.yandex_delivery_id}'
                headers = {
                    'Accept-Language': 'ru',
                    'Authorization': f'Bearer {self.yandex_token}',
                }
                response = requests.post(
                    url=delivery_info_url, headers=headers)

                status_delivery_schema = self.form_status_schema(
                    text=response.text)

                self.valid_status(
                    status_delivery_schema=status_delivery_schema,
                    delivery=delivery)

                time.sleep(self.timeout)
        return

    def form_status_schema(self, text: str) -> StatusDeliverySchema:
        """Формирует схема для статуса доставки."""

        status_delivery_schema = StatusDeliverySchema.model_validate_json(text)
        return status_delivery_schema

    def valid_status(
            self,
            status_delivery_schema: StatusDeliverySchema,
            delivery: Delivery,
    ) -> StatusDeliverySchema:
        """Сравнивает статус от яндекса и сервера."""

        for status_enum in StatusEnum:
            if status_delivery_schema.status.upper().startswith(
                    status_enum.name):
                self.save_status(delivery=delivery, status_enum=status_enum)
                status_delivery_schema.status_ru = status_enum.value[1]
                status_delivery_schema.status = status_enum.name
                self.status_delivery_list.append(status_delivery_schema)
                return status_delivery_schema

    def save_status(self, delivery: Delivery, status_enum: StatusEnum) -> None:
        """Сохраняет статус."""

        delivery.status = status_enum.value[0]
        delivery.save()
        return

    def response_for_delivery_types(self, data_delivery: dict) -> dict:
        """Запрос на получение типов доставок."""

        from core.service.facades import JsonToPython

        headers = {
            'Accept-Language': 'ru',
            'Authorization': f'Bearer {str(settings.YANDEX_TOKEN)}',
        }

        data = {
            "requirements": {
                "taxi_class": "express"
            },
            "route_points": [
                {
                    "fullname": data_delivery.get('shop_address'),
                },
                {
                    "fullname": data_delivery.get('recipient_address'),
                },
            ],
            "skip_door_to_door": True,
        }

        response = requests.post(
            url=self.delivery_types_url,
            headers=headers,
            json=data,
        )

        response_py = JsonToPython.turn_json_to_python(response=response)
        return response_py

    def parse_delivery_types(self, offers: list) -> dict:
        """Парсит типы доставок."""

        price_types_info = {}

        price_types = []
        price_type = {}
        if offers:
            for offer in offers:
                description = offer.get('description')
                if str(description) == self.EXPRESS_DELIVERY_TYPE:
                    price_type = self.parse_delivery_type(
                        price_type=price_type,
                        offer=offer,
                    )

                    price_types.append(price_type)

            price_types_info['status'] = True

            type_delivery_pickup = self.get_type_delivery_pickup()
            price_types.append(type_delivery_pickup)
            price_types_info['price_types'] = price_types

            return price_types_info

        price_types_info['status'] = False

        type_delivery_pickup = self.get_type_delivery_pickup()
        price_types.append(type_delivery_pickup)
        price_types_info['price_types'] = price_types

        return price_types_info

    def get_type_delivery_pickup(self) -> dict:
        """Получает тип доставки "Самовывоз" """

        delivery_type = DeliveryTypes.get_type_str(
            description=self.TYPE_DELIVERY_PICKUP_NAME)

        return {
            "price": settings.TYPE_DELIVERY_PICKUP_PRICE_DEFAULT,
            "ratio": 1,
            "description": self.TYPE_DELIVERY_PICKUP_NAME,
            "pickup_to": "",
            "delivery_to": "",
            "delivery_to_datetime": None,
            "delivery_type": delivery_type,
            "is_pickup": True,
        }

    def parse_delivery_type(
            self,
            price_type: dict,
            offer: dict,
            ) -> dict:
        """Парсит тип доставки."""

        price_type['price'] = offer.get('price').get('total_price_with_vat')

        price_type['ratio'] = offer.get('price').get('surge_ratio')

        description = offer.get('description')
        price_type['description'] = description

        pickup_to = offer.get('pickup_interval').get('to')
        delivery_to = offer.get('delivery_interval').get('to')

        pickup_to_datetime = DeliveryTimeSchema.model_validate(
            {'pickup_to': pickup_to, 'delivery_to': delivery_to})
        pickup_to_datetime_plus = pickup_to_datetime.pickup_to + timedelta(hours=5)

        price_type['pickup_to'] = pickup_to_datetime_plus.strftime(
            '%H:%M')

        delivery_to_datetime_plus = pickup_to_datetime.delivery_to + timedelta(hours=5)
        price_type['delivery_to'] = delivery_to_datetime_plus.strftime(
            '%H:%M')
        price_type['delivery_to_datetime'] = delivery_to_datetime_plus

        delivery_type = DeliveryTypes.get_type_str(
            description=description)
        price_type['delivery_type'] = delivery_type

        return price_type

    def get_delivery_types(
            self,
            data_delivery: dict,
            ) -> list:
        """Расчитывает доставку."""

        response_py = self.response_for_delivery_types(
            data_delivery=data_delivery)

        offers = response_py.get('offers')

        price_types_info = self.parse_delivery_types(offers=offers)
        if price_types_info.get('status'):
            price_types = price_types_info.get('price_types')
            return price_types
        else:
            LOGGER.warning(f'{offers} --- {data_delivery}')

            delivery_price_default = self.get_delivery_price_default()
            price_types = price_types_info.get('price_types')
            delivery_price_default += price_types

            return delivery_price_default

    def get_delivery_price_default(self) -> list:
        """Получает цену доставки по умолчанию"""

        delivery_to_datetime = datetime.now() + timedelta(
            hours=self.delivery_period_hours_default)

        return [{
            "price": settings.DELIVERY_PRICE_DEFAULT,
            "ratio": 1,
            "description": "express",
            "pickup_to": "",
            "delivery_to": "",
            "delivery_to_datetime": delivery_to_datetime,
            "delivery_type": "Доставка---0",
            "errors": {
                "message": self.error_message_address,
                "message2": self.error_message_delivery_price,
            }
        }]

    def get_journal(self) -> list:
        """
            Получает журнал с изменениями.
        """

        from core.service.facades import JsonToPython
        headers = {
            'Accept-Language': 'ru',
            'Authorization': f'Bearer {self.yandex_token}',
        }

        response = requests.post(
            url=self.delivery_journal_url, headers=headers)

        response_py = JsonToPython.turn_json_to_python(response=response)

        events = response_py.get('events')
        return events


class FacadeDelivery():
    """Фасад Доставка."""

    model = Delivery
    facade_cart_item = FacadeCartItem()
    facade_recipient_data = FacadeRecipientData()
    CANCELLED = 3
    IN_PROCESS = 1
    DELIVERED = 2
    DELIVERED_FINISH = 'delivered_finish'
    time_delta_hours = 5
    expired_time_in_days = 7

    TYPE_DELIVERY_PICKUP = 'Самовывоз'

    def __init__(self, delivery_engine: BaseDelivery = None) -> None:
        self.delivery_engine = delivery_engine

    def get_delivery(self, id: str) -> Delivery:
        """
            Получает доставку по id.
        """

        delivery = self.model.objects.filter(id=int(id)).first()
        return delivery

    def get_deliveries(self, user: User) -> QuerySet:
        """
            Получает доставки.
        """

        deliveries = self.model.objects.filter(order__cart__user=user)

        return deliveries

    def _set_delivery_type(
            self,
            delivery: Delivery,
            delivery_type: str = None,
            ) -> Delivery:
        """
            Устанавливает delivery_type для delivery.
        """

        delivery.delivery_type = int(delivery_type)
        delivery.save()
        return delivery

    def _set_delivery_period(
            self,
            delivery: Delivery,
            delivery_to_datetime: DeliveryTimeSchema = None,
            ) -> Delivery:
        """
            Устанавливает delivery_period для delivery.
        """

        if not delivery_to_datetime:
            delivery_period = self.TYPE_DELIVERY_PICKUP
        else:
            delivery_period = delivery_to_datetime.delivery_to.strftime('%d-%m-%Y %H:%M')

        delivery.delivery_period = delivery_period
        delivery.save()

        return delivery

    def _set_delivery_end(
            self,
            delivery: Delivery,
            delivery_end_str: str = None,
            ) -> DeliveryTimeSchema:
        """
            Устанавливает delivery_end для delivery.
        """

        try:
            delivery_to_datetime = DeliveryTimeSchema.model_validate(
                {'delivery_to': delivery_end_str})
        except Exception as er:
            LOGGER.warning(er)
            delivery.delivery_end = None
            delivery.save()
            return None
        else:
            delivery.delivery_end = delivery_to_datetime.delivery_to
            delivery.save()

            return delivery_to_datetime

    def create_delivery_instance(
            self,
            order: Order,
            user_id: int = None,
            delivery_end_str: str = None,
            delivery_type: str = None,
            ) -> Delivery:
        """
            Создает доставку.
        """

        delivery = self.model.objects.create(order=order)
        # delivery.delivery_period = order.cart.favorite_address.delivery_time

        try:
            delivery_to_datetime = DeliveryTimeSchema.model_validate(
                {'delivery_to': delivery_end_str})
        except Exception as er:
            LOGGER.warning(er)
            delivery_to_datetime = None

        self._set_delivery_period(
            delivery=delivery, delivery_to_datetime=delivery_to_datetime
        )

        self._set_delivery_type(delivery=delivery, delivery_type=delivery_type)

        self._set_address_for_delivery(delivery=delivery)

        return delivery

    def _set_address_for_delivery(
            self,
            delivery: Delivery,
            ) -> None:
        """
            Устанавливает адрес для доставки.
        """

        favorite_address = delivery.order.cart.favorite_address
        delivery.recipient_address = favorite_address
        delivery.save()

        return

    def add_total_cost_for_shop(
            self,
            cart_items: QuerySet,
            delivery: Delivery,
    ) -> None:
        """Добавляет общую стоимость заказа для магазина."""

        total_cost_for_shop = round(
            sum(item.get_cost for item in cart_items), 2)
        delivery.order_cost = total_cost_for_shop
        delivery.save()

        return

    def add_delivery_cost_for_shop(
            self,
            delivery_cost: str,
            delivery: Delivery,
    ) -> None:
        """Добавляет стоимость доставки для магазина."""

        try:
            delivery.delivery_cost = float(delivery_cost)
            delivery.save()
        except Exception as ex:
            LOGGER.warning(f'{ex}')
            delivery.delivery_cost = 0
            delivery.save()

        return

    def create_delivery(
            self,
            order: Order,
            order_data: dict,
            user_id: int = None,
    ) -> None:
        """
            Создает доставки.
        """
        from .facade_order import FacadeOrder
        facade_order = FacadeOrder()

        filter_data = {
            'is_selected': True,
            'max_quantity__gte': 1,
        }

        valid_shop_names = order_data.get('valid_shop_names')
        for shop_name_delivery_cost in valid_shop_names:
            shop_name, delivery_cost, delivery_end_str, delivery_type = shop_name_delivery_cost.split('---')

            delivery = self.create_delivery_instance(
                order=order,
                user_id=user_id,
                delivery_end_str=delivery_end_str,
                delivery_type=delivery_type,
            )

            if order_data.get('web_shop_handler'):
                filter_data.update({'shop__web_shop__site': shop_name})
            if order_data.get('shop_handler'):
                filter_data.update({'shop__name': shop_name})

            cart_items = facade_order.filter_cart_items_for_order(
                order=order,
                filter_data=filter_data,
            )

            self._add_delivery_to_cart_item(
                cart_items=cart_items,
                delivery=delivery,
            )

            self.add_total_cost_for_shop(
                cart_items=cart_items,
                delivery=delivery,
            )

            self.add_delivery_cost_for_shop(
                delivery_cost=delivery_cost,
                delivery=delivery,
            )

        return

    def _add_delivery_to_cart_item(
            self,
            cart_items: QuerySet,
            delivery: Delivery,
    ) -> None:
        """Добавляет доставку для позиции корзины."""

        for cart_item in cart_items:
            # cart_item.delivery = delivery
            cart_item.deliveries.add(delivery)
            cart_item.save()
        return

    def check_status(self, data_delivery: dict) -> Union[dict, None]:
        """Проверяет статусы доставок."""

        status_delivery_list_schema = self.delivery_engine.check_status(
            data_delivery=data_delivery)

        user_id = data_delivery.get('user_id')
        orders = Order.objects.filter(
            cart__user__id=int(user_id), status__lte=self.IN_PROCESS)
        self.check_order_statuses(orders=orders)

        return status_delivery_list_schema

    def get_deliveries_query(self, data_filter: dict, exclude_filter: dict = {}) -> QuerySet:
        """Фильтрует доставки."""

        deliveries = self.model.objects.filter(
            **data_filter).exclude(**exclude_filter)
        return deliveries

    def cancell_delivery(self, delivery_data: dict) -> str:
        """
            Отменяет доставку.
        """

        action = 'CANCELL'

        delivery = self.handle_cancellation(
            delivery_data=delivery_data, action=action)
        if isinstance(delivery, Delivery):
            return delivery.id
        else:
            return delivery

    def check_order_status(self, order_id: int) -> None:
        """
            Проверяет статус заказа.
        """

        from .facade_order import FacadeOrder

        facade_order = FacadeOrder()
        facade_order.check_order_status(order_id=order_id)

        return

    def check_order_statuses(self, orders: QuerySet) -> None:
        """
            Проверяет статусы заказов
        """

        from .facade_order import FacadeOrder

        facade_order = FacadeOrder()
        facade_order.check_order_statuses(orders=orders)

        return

    def get_delivery_by_yandex_delivery_id(
            self,
            yandex_delivery_id: str,
            ) -> Delivery:
        """
            Получает доставку по yandex_delivery_id.
        """

        delivery = self.model.objects.filter(
            yandex_delivery_id=str(yandex_delivery_id)).first()
        return delivery

    def check_delivery_end(self, delivery_id: str = None) -> dict:
        """
            Проверяет время окончания доставки.
        """

        delivery = self.get_delivery(
            id=delivery_id,
        )

        if not delivery.yandex_delivery_id:
            return {
                'delivery_end': None,
                'status': delivery.get_status_display(),
            }

        events = self.delivery_engine.get_journal()

        if events:
            delivery_end = self.parse_journal(
                events=events,
                yandex_delivery_id=delivery.yandex_delivery_id,
                delivery=delivery,
            )
            return delivery_end
        else:
            return {
                'delivery_end': None,
                'status': delivery.get_status_display(),
            }

    def parse_journal(
            self,
            events: list,
            yandex_delivery_id: str,
            delivery: Delivery,
            ) -> dict:
        """
            Парсит журнал изменений.
        """

        for event in events:
            if event.get('claim_id') == yandex_delivery_id and event.get('new_status') == self.DELIVERED_FINISH:
                return self.set_delivery_end(event=event, delivery=delivery)

        delivery = self.set_delivery_end_no_yandex_delivery_id(
            delivery=delivery)
        return self.set_delivery_end_for_front(delivery=delivery)

    def set_delivery_end(self, event: dict, delivery: Delivery) -> dict:
        """
            Устанавливает delivery_end.
        """

        delivery_finish_time = datetime.strptime(
            event.get('updated_ts').split('.')[0], "%Y-%m-%dT%H:%M:%S")

        delivery_end = delivery_finish_time + timedelta(
            hours=self.time_delta_hours)

        delivery.delivery_end = delivery_end
        delivery.status = self.DELIVERED
        delivery.save()
        return self.set_delivery_end_for_front(delivery=delivery)

    def set_delivery_end_no_yandex_delivery_id(
            self,
            delivery: Delivery,
            ) -> Delivery:
        """
            Устанавливает delivery_end если в журнале нет claim_id.
        """

        time_delta_hours = 1
        delivery_end = delivery.delivery_time_start + timedelta(
            hours=time_delta_hours)

        delivery.delivery_end = delivery_end
        delivery.status = self.DELIVERED
        delivery.save()
        return delivery

    def set_delivery_end_for_front(self, delivery: Delivery) -> dict:
        """
            Устанавливает delivery_end для фронта.
        """

        locale.setlocale(locale.LC_TIME, 'ru_RU.UTF-8')

        datetime_format = '%d %B %Y г. %H:%M'
        delivery_end_data_front = {
            'delivery_end': delivery.delivery_end.strftime(datetime_format),
            'status': delivery.get_status_display(),
        }
        return delivery_end_data_front

    def check_delivery_returning_time_expired(
            self,
            data_delivery: dict
            ) -> bool:
        """
            Проверяет прошел ли срок для возврата товара.
        """

        delivery_id = data_delivery.get('delivery_id')

        delivery = self.get_delivery(id=delivery_id)
        if delivery.status == self.DELIVERED:
            expired_time = delivery.delivery_end + timedelta(
                days=self.expired_time_in_days)
            if timezone.now() > expired_time:
                data_back = {'expired': True, 'show_btn': False}
            else:
                data_back = {'expired': False, 'show_btn': True}
        else:
            data_back = {'expired': True, 'show_btn': False}
        return data_back

    def return_delivery(self, delivery_data: dict) -> str:
        """
            Возвращает доставку.
        """

        action = 'RETURN'

        delivery = self.handle_cancellation(
            delivery_data=delivery_data, action=action)
        if isinstance(delivery, Delivery):
            LOGGER.info(f'Стоимость товаров в доставке: {delivery.order_cost}')
            LOGGER.info(f'Стоимость доставки: {delivery.delivery_cost}')
            return delivery
        else:
            return delivery

    def handle_cancellation(
            self,
            delivery_data: dict,
            action: str,
            ) -> Union[str, Delivery]:
        """
            Работает с логикой отмены доставки.
        """

        delivery_id = delivery_data.get('delivery_id')
        delivery = self.get_delivery(id=delivery_id)
        if delivery:
            delivery.status = self.CANCELLED
            delivery.save()
            delivery.delivery_end = delivery.updated + timedelta(minutes=1)
            delivery.save()

            # self.check_order_status(order_id=delivery.order.id)

            # task_delivery_cancellation_to_telegram.apply_async(
            #     args=[delivery.id, delivery.yandex_delivery_id, action],
            #     serializer="json",
            #     )
            return delivery
        return delivery_id

    def handle_cancellation_bulk(self, deliveries_to_cancell: list) -> None:
        """Работает с логикой отмены доставок"""

        for delivery in deliveries_to_cancell:
            delivery.status = self.CANCELLED
            delivery.save()
            delivery.delivery_end = delivery.updated + timedelta(minutes=1)
            delivery.save()
        return None
