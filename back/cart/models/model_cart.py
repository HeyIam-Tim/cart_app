from typing import Optional, Union, NamedTuple

from django.conf import settings

from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
from datetime import datetime
from django.utils import timezone
from django.db.models.query import QuerySet
import uuid

from .model_mixins import CreatedMixin, UpdatedMixin
from core.models.model_shops import Shop

delta_hours = 1
WAIT_STATE = 1
CHECKBOX_STATE = 2

LOGGER = settings.LOGGER


class Cart(CreatedMixin, UpdatedMixin, models.Model):
    """Корзина."""

    user = models.OneToOneField(
        User,
        verbose_name="Пользователь",
        related_name="cart",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    @property
    def get_cart_items(self) -> list:
        """Получает позиции корзины."""

        cart_items = self.cart_items.filter(shop__isnull=False)
        if cart_items:
            return list(cart_items)
        else:
            return []

    @property
    def get_cart_items_ordered_by_shops(self) -> list:
        """Получает позиции корзины отсортированные по магазинам."""

        cart_items = self.get_cart_items
        return self.sort_cart_items(cart_items=cart_items, type='')

    @property
    def get_available_selected_cart_items_for_cart(self) -> dict:
        """Получает доступные выбранные позиции корзины для корзины."""

        cart_items = self.cart_items.filter(shop__isnull=False)
        return self.sort_cart_items(cart_items=cart_items, type='cart')

    @property
    def get_available_selected_cart_items(self) -> dict:
        """Получает доступные выбранные позиции корзины для формирования заказа."""

        cart_items = self.cart_items.filter(is_selected=True, shop__isnull=False)
        return self.sort_cart_items(cart_items=cart_items, type='create_offer')

    @property
    def get_selected_cart_items_ordered_by_shops(self) -> list:
        """Получает выбранные позиции корзины отсортированные по магазинам."""

        cart_items = self.cart_items.filter(is_selected=True, shop__isnull=False).exists()
        return cart_items

    @property
    def get_cart_items_count_all(self) -> int:
        """Получает все количество позиций в корзине (шт)."""

        order_item_quantities = sum(
            int(item.cart_item_quantity) for item in self.cart_items.filter(shop__isnull=False)
            # int(item.cart_item_quantity) for item in self.get_cart_items
        )
        if order_item_quantities:
            return order_item_quantities
        else:
            return 0

    @property
    def get_cart_items_count(self) -> int:
        """Получает количество (CHECKBOX_STATE) позиций в корзине (шт)."""

        order_item_quantities = sum(
            int(item.cart_item_quantity)
            for item in self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False)
        )
        if order_item_quantities:
            return order_item_quantities
        else:
            return 0

    @property
    def get_cart_items_number(self) -> int:
        """Получает количество позиций в корзине."""

        return self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False).count()

    @property
    def get_selected_cart_items_number(self) -> int:
        """Получает количество выбранных позиций в корзине."""

        available_count = 0
        cart_items = self.cart_items.filter(is_selected=True, state=CHECKBOX_STATE, shop__isnull=False)
        for cart_item in cart_items:
            if cart_item.action_for_state != "Not Available":
                available_count += 1
        return available_count

    @property
    def get_selected_cart_items_count(self) -> int:
        """Получает количество выбранных позиций в корзине (шт)."""

        order_item_quantities = sum(
            int(item.cart_item_quantity)
            for item in self.cart_items.filter(is_selected=True, state=CHECKBOX_STATE, shop__isnull=False)
        )
        if order_item_quantities:
            return order_item_quantities
        else:
            return 0

    @property
    def get_total_cost(self):
        """Подсчитывает общую сумму для корзины."""

        return round(
            sum(item.get_cost for item in self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False)),
            2,
        )

    @property
    def get_total_cost_for_selected(self):
        """Подсчитывает общую сумму для корзины с выбранными позициями."""

        return round(
            sum(
                item.get_cost
                for item in self.cart_items.filter(
                    is_selected=True,
                    state=CHECKBOX_STATE,
                    shop__isnull=False,
                )
            ),
            2,
        )

    @property
    def favorite_address(self):
        """Получает выбранный адрес."""

        favorite_address = self.addresses.filter(is_favorite=True).first()
        if favorite_address:
            return favorite_address
        else:
            return self.addresses.first()

    def sort_cart_items(
        self,
        cart_items: QuerySet,
        type: str,
    ) -> dict:
        """Сортирует позиции корзины по магазинам."""

        from cart.services.facades import FacadeCart

        facade_cart = FacadeCart()
        cart_items_ordered_by_shops = facade_cart.sort_cart_items(
            cart_items=cart_items,
            type=type,
        )
        return cart_items_ordered_by_shops

    def check_wait_states(self) -> bool:
        """Проверяет WAIT состояния у корзины."""

        cart_items = self.cart_items.filter(shop__isnull=False)
        for cart_item in cart_items:
            if cart_item.state == WAIT_STATE:
                return True
        return False

    class Meta:
        ordering = ("-created",)
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"

    def __str__(self):
        return f"{self._meta.object_name}: {self.id}"


class TelegramReply(NamedTuple):
    """для ответа в тг"""

    chat_id: str
    message_id: str


class Order(CreatedMixin, UpdatedMixin, models.Model):
    """Заказ."""

    NEW = 0
    IN_PROCESS = 1
    FINISHED = 2
    CANCELLED = 3
    PAID = 4

    STATUSES = (
        (NEW, "Новый"),
        (PAID, "Оплачен"),
        (IN_PROCESS, "В пути"),
        (FINISHED, "Выполнен"),
        (CANCELLED, "Отменен"),
        (PAID, "Оплачен"),
    )

    uuid = models.UUIDField(
        verbose_name="Уникальный id для Заказа",
        default=uuid.uuid4,
        null=True,
        blank=True,
    )
    cart = models.ForeignKey(
        "cart.Cart",
        verbose_name="Корзина",
        related_name="orders",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    status = models.PositiveSmallIntegerField(
        verbose_name="Статус", choices=STATUSES, default=NEW
    )
    clean_telegram_messages = models.TextField(
        verbose_name="Телеграм сообщения", null=True, blank=True, default='',
    )

    paykeeper_id = models.PositiveIntegerField(
        verbose_name='Id платежа в системе Paykeeper',
        null=True, blank=True,
    )
    receipt_history = models.TextField(
        verbose_name="Ссылки на чеки Paykeeper",
        null=True, blank=True,
        default='',
    )

    class Meta:
        ordering = ("-created",)
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"{self.cart.user}: {self.id}"

    @property
    def get_total_cost(self):
        """Подсчитывает общую сумму для заказа."""

        return round(
            sum(item.get_cost for item in self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False)),
            2,
        )

    @property
    def get_total_delivery_cost(self) -> float:
        """Подсчитывает общую сумму для доставок."""

        return round(sum(item.delivery_cost for item in self.deliveries.all()), 2)

    @property
    def get_full_order_cost(self):
        """Подсчитывает общую сумму для заказа + доставка."""

        total_cost = self.get_total_cost
        total_delivery_cost = self.get_total_delivery_cost

        total_cost += float(settings.SERVICE_FEE)  # сервисный сбор

        return round(total_cost + total_delivery_cost, 2)

    @property
    def delivery_time(self):
        """Подсчитывает время доставки."""

        delivery_time = self.created + timedelta(hours=delta_hours)
        return delivery_time.date()

    @property
    def is_paid(self) -> bool:
        """Проверяет оплачен ли заказ."""

        if self.status == self.PAID:
            return True
        return False

    @property
    def is_new(self) -> bool:
        """Проверяет новый ли заказ."""

        if self.status == self.NEW:
            return True
        return False

    CANCELL_PERIOD_HOURS = 1

    @property
    def can_be_cancelled(self) -> bool:
        """Проверяет можно ли отменить заказ в течении заданого периода"""

        from cart.services.facades import FacadeOrder

        facade_order = FacadeOrder()
        can_be_cancelled = facade_order.can_be_cancelled(order=self)
        return can_be_cancelled

    @property
    def telegram_messages(self) -> list:
        """Телеграм сообщения для ответа"""

        telegram_message_list = []
        telegram_messages = self.clean_telegram_messages.split(' ')
        for telegram_message_id in telegram_messages:
            if telegram_message_id:
                chat_id, message_id = telegram_message_id.split(',')
                telegram_reply = TelegramReply(chat_id=chat_id, message_id=message_id)
                telegram_message_list.append(telegram_reply)
        return telegram_message_list


class HistoryOrder(CreatedMixin, UpdatedMixin, models.Model):
    """История заказа"""

    order = models.ForeignKey(
        "cart.Order",
        verbose_name="Заказ",
        related_name="history",
        on_delete=models.CASCADE,
    )
    history_point = models.CharField(
        verbose_name="Пункт истроии", max_length=63, null=True, blank=True
    )

    def __str__(self) -> str:
        return f"{self.order} - {self.history_point}"

    class Meta:
        verbose_name: str = "История заказа"
        verbose_name_plural = "История заказов"


class Delivery(CreatedMixin, UpdatedMixin, models.Model):
    """Доставка."""

    NEW = 0
    IN_PROCESS = 1
    DELIVERED = 2
    CANCELLED = 3

    STATUSES = (
        (NEW, "Новый"),
        (IN_PROCESS, "В пути"),
        (DELIVERED, "Доставлен"),
        (CANCELLED, "Отменен"),
    )

    order = models.ForeignKey(
        "cart.Order",
        verbose_name="Заказ",
        related_name="deliveries",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    recipient_address = models.ForeignKey(
        "cart.RecipientData",
        verbose_name="Данные получателя",
        related_name="deliveries",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    uuid = models.UUIDField(
        verbose_name="Уникальный id для Доставки",
        default=uuid.uuid4,
        null=True,
        blank=True,
    )
    delivery_cost = models.FloatField(
        verbose_name="Стоимость доставки", null=True, blank=True
    )
    delivery_period = models.CharField(
        verbose_name="Срок доставки", max_length=63, null=True, blank=True
    )
    delivery_end = models.DateTimeField(
        verbose_name="Время завершения доставки", null=True, blank=True
    )
    order_cost = models.FloatField(
        verbose_name="Стоимость заказа", null=True, blank=True
    )
    width = models.CharField(
        verbose_name="Ширина", default="0,6", max_length=15, null=True, blank=True
    )
    height = models.CharField(
        verbose_name="Высота", default="0,5", max_length=15, null=True, blank=True
    )
    length = models.CharField(
        verbose_name="Длина", default="1", max_length=15, null=True, blank=True
    )
    weight = models.CharField(
        verbose_name="Вес", default="", max_length=15, null=True, blank=True
    )
    status = models.PositiveSmallIntegerField(
        verbose_name="Статус", choices=STATUSES, default=NEW
    )

    yandex_delivery_id = models.CharField(
        verbose_name="Яндекс ID", default="", max_length=35, null=True, blank=True
    )

    TYPE_EXPRESS = 0
    TYPE_EXPRESS_30MIN_LONGER = 1
    TYPE_2_HOURS_DELIVERY = 2
    PICKUP = 3

    DELIVERY_TYPES = (
        (TYPE_EXPRESS, "Экспресс"),
        (TYPE_EXPRESS_30MIN_LONGER, "Экспресс +30 мин"),
        (TYPE_2_HOURS_DELIVERY, "За 2 часа"),
        (PICKUP, "Самовывоз"),
    )
    delivery_type = models.PositiveSmallIntegerField(
        verbose_name="Тип доставки", choices=DELIVERY_TYPES, default=TYPE_EXPRESS
    )

    def __str__(self):
        return f"{self._meta.object_name}: {self.id}"

    class Meta:
        verbose_name = "Доставка"
        verbose_name_plural = "Доставки"

    @property
    def get_total_cost(self):
        """Подсчитывает стоимость товаров."""

        return round(
            sum(item.get_cost for item in self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False)),
            2,
        )

    @property
    def get_full_cost(self) -> float:
        """Подсчитывает общую сумму для магазина + доставка."""

        return round(self.order_cost + self.delivery_cost, 2)

    @property
    def get_cart_items_count(self) -> int:
        """Получает количество позиций в доставке (шт)."""

        order_item_quantities = sum(
            int(item.cart_item_quantity)
            for item in self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False)
        )
        if order_item_quantities:
            return order_item_quantities
        else:
            return 0

    @property
    def get_cart_items_number(self) -> int:
        """Получает количество позиций в доставке."""

        return self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False).count()

    @property
    def delivery_items(self) -> QuerySet:
        """Позиции для доставки."""
        # return self.cart_items.all()
        return self.cart_items.filter(state=CHECKBOX_STATE, shop__isnull=False)

    delivery_items.fget.short_description = "Позиции для доставки"

    @property
    def receiver(self):
        """Получатель."""

        return self.recipient_address

    receiver.fget.short_description = "Получатель"

    @property
    def receiver_name(self):
        """ФИО получателя."""

        return self.recipient_address.recipient_name

    receiver_name.fget.short_description = "ФИО получателя"

    @property
    def receiver_address(self) -> str:
        """Адрес получателя."""

        if self.recipient_address:
            return self.recipient_address.address_delivery
        else:
            return ""

    receiver_address.fget.short_description = "Адрес получателя"

    @property
    def receiver_phone(self) -> str:
        """Телефон получателя."""

        if self.recipient_address:
            return self.recipient_address.phone
        else:
            return ""

    receiver_phone.fget.short_description = "Телефон получателя"

    @property
    def sender(self) -> Optional[Shop]:
        """Отправитель."""
        if self.cart_items.first():
            # return self.cart_items.filter(shop__isnull=False).first().shop
            return self.cart_items.filter(shop__web_shop__isnull=False).first().shop.web_shop
        else:
            return

    @property
    def sender_address(self) -> str:
        """Адрес отправителя."""

        if not self.sender:
            return "Нет отправителя"
        return self.sender.address

    sender_address.fget.short_description = "Адрес отправителя"

    @property
    def sender_name(self) -> str:
        """Наименование отправителя."""

        if not self.sender:
            return "Нет отправителя"
        # return self.sender.name
        return self.sender.legal_entity

    sender_name.fget.short_description = "Наименование отправителя"

    @property
    def sender_phone(self) -> str:
        """Телефон отправителя."""

        if not self.sender:
            return "Нет отправителя"
        # return self.sender.phone_number
        return ''

    sender_phone.fget.short_description = "Телефон отправителя"

    @property
    def order_uuid(self) -> str:
        """Уникальный id для Заказа."""

        return self.order.uuid

    order_uuid.fget.short_description = "Уникальный id для Заказа"

    @property
    def product_names(self) -> str:
        """Наименования для позиций доставки."""

        product_names = [
            "" + f"{item.product_name}" for item in self.cart_items.filter(shop__isnull=False)[:3]
        ]
        return product_names

    product_names.fget.short_description = "Наименования"

    @property
    def delivery_time_start(self) -> str:
        """Время начала доставки."""

        return self.created + timedelta(minutes=1)

    @property
    def delivery_time_end(self) -> Union[str, None]:
        """Время равершения доставки."""

        if self.status >= self.DELIVERED:
            return self.delivery_end
        return

    @property
    def get_delivery_period(self) -> str:
        """Время равершения доставки."""

        return self.delivery_period.split(" ")[0]

    @property
    def user_passport(self):  # -> Passport | None:
        """Паспорт"""

        try:
            passport = self.order.cart.user.passport
        except Exception as er:
            LOGGER.info(er)
            return None
        else:
            return passport


class CartItem(CreatedMixin, UpdatedMixin, models.Model):
    """Позиция корзины."""

    carts = models.ManyToManyField(
        "cart.Cart", verbose_name="Корзины", related_name="cart_items", blank=True
    )
    orders = models.ManyToManyField(
        "cart.Order", verbose_name="Заказы", related_name="cart_items", blank=True
    )
    shop = models.ForeignKey(
        "core.Shop",
        verbose_name="Магазин",
        related_name="cart_items",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    deliveries = models.ManyToManyField(
        "cart.Delivery", verbose_name="Доставки", related_name="cart_items", blank=True
    )
    cart_item_id = models.TextField(
        verbose_name="Хеш позиции корзины", null=True, blank=True, unique=True
    )
    product_name = models.CharField(
        verbose_name="Наименование товара", max_length=255, null=True, blank=True
    )
    article = models.CharField(
        verbose_name="Артикул", max_length=63, null=True, blank=True
    )
    brand = models.CharField(verbose_name="Бренд", max_length=63, null=True, blank=True)
    old_price = models.FloatField(verbose_name="Старая цена", null=True, blank=True)
    price = models.FloatField(verbose_name="Цена", null=True, blank=True)
    delivery_period = models.CharField(
        verbose_name="Срок доставки", max_length=63, null=True, blank=True
    )
    cart_item_quantity = models.FloatField(
        verbose_name="Количество для позиции", null=True, blank=True
    )
    max_quantity = models.FloatField(
        verbose_name="Максимальное количество", null=True, blank=True
    )
    delivery_cost = models.FloatField(
        verbose_name="Стоимость доставки", null=True, blank=True
    )
    image_url = models.TextField(
        verbose_name="Ссылка на изображение", null=True, blank=True
    )
    comment = models.TextField(verbose_name="Комментарий", null=True, blank=True)
    is_selected = models.BooleanField(
        verbose_name="Выбран (чекбокс)", null=True, blank=True, default=False
    )

    CALCULATE = 0
    WAIT = 1
    CHECKBOX = 2

    STATES = (
        (CALCULATE, "Проценка"),
        (WAIT, "Ожидание"),
        (CHECKBOX, "Чекбокс"),
    )
    state = models.PositiveSmallIntegerField(
        verbose_name="Состояние", choices=STATES, default=CHECKBOX
    )

    class Meta:
        ordering = ("-created",)
        verbose_name = "Позиция корзины"
        verbose_name_plural = "Позиции корзин"

    def __str__(self):
        return f"{self._meta.object_name}: {self.id}"

    @property
    def get_cost(self):
        """Подсчитывает сумму для позиции."""

        if not self.cart_item_quantity or not self.price:
            return 0.0
        else:
            return round(self.price * self.cart_item_quantity, 2)

    def get_cart_item_quantity_int(self):
        """Получает количетво позиции корзины int."""

        return int(self.cart_item_quantity)

    @property
    def delivery_time(self):
        """Подсчитывает время доставки."""

        delivery_time = datetime.now() + timedelta(hours=delta_hours)
        return delivery_time.date()

    @property
    def delivery_price(self):
        """Подсчитывает стоимость доставки."""

        from cart.services.facades import FacadeCartItem

        facade_cart_item = FacadeCartItem()
        delivery_price = facade_cart_item.get_delivery_price(
            shop=self.shop,
            quantity=self.cart_item_quantity,
            price=self.price,
        )

        return delivery_price

    @property
    def action_for_state(self) -> str:
        """Действие для состояния."""

        expired_hours = 24
        expired_date = timezone.now() - timedelta(hours=expired_hours)

        if self.updated < expired_date:
            if self.state != self.CALCULATE:
                self.state = self.CALCULATE
                self.is_selected = False
                self.save()
            return "Calculate"
        if int(self.state) == int(self.WAIT):
            return "Wait"
        if not self.max_quantity:
            return "Not Available"
        if int(self.state) == int(self.CHECKBOX):
            return "Checkbox"
        return "Calculate"

    @property
    def price_color(self) -> str:
        """Цвет для цены."""

        if not self.old_price:
            return ""

        price_difference = self.old_price - self.price
        if price_difference == 0 or self.old_price == 0:
            return ""
        elif price_difference < 0:
            return "red"
        else:
            return "green"

    @property
    def price_difference(self) -> str:
        """Разница в цене."""

        if not self.old_price:
            return ""

        price_difference = self.old_price - self.price
        price_difference = round(float(price_difference), 2)
        if price_difference == 0 or self.old_price == 0:
            return ""
        elif price_difference < 0:
            return f"↑{abs(price_difference)}"
        else:
            return f"↓{price_difference}"


class RecipientData(CreatedMixin, UpdatedMixin, models.Model):
    """Данные получателя."""

    cart = models.ForeignKey(
        "cart.Cart",
        verbose_name="Корзина",
        related_name="addresses",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    order = models.OneToOneField(
        "cart.Order",
        verbose_name="Заказ",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="address",
    )
    address_delivery = models.CharField(
        verbose_name="Адрес доставки", max_length=255, null=True, blank=True
    )
    porch = models.CharField(
        verbose_name="Подъезд", max_length=15, null=True, blank=True
    )
    floor = models.CharField(verbose_name="Этаж", max_length=15, null=True, blank=True)
    appartment = models.CharField(
        verbose_name="Квартира", max_length=15, null=True, blank=True
    )
    door_code = models.CharField(
        verbose_name="Домофон", max_length=15, null=True, blank=True
    )
    postal_code = models.CharField(
        verbose_name="Почтовый индекс", max_length=20, null=True, blank=True
    )
    recipient_name = models.CharField(
        verbose_name="ФИО получателя", max_length=127, null=True, blank=True
    )
    email = models.EmailField(
        verbose_name="Емейл", max_length=63, null=True, blank=True
    )
    phone = models.CharField(
        verbose_name="Телефон получателя", max_length=20, null=True, blank=True
    )
    longitude = models.CharField(
        verbose_name="Долгота", max_length=20, null=True, blank=True
    )
    latitude = models.CharField(
        verbose_name="Широта", max_length=20, null=True, blank=True
    )
    is_favorite = models.BooleanField(
        verbose_name="Выбранный адрес", null=True, blank=True, default=False
    )
    is_valid_address = models.BooleanField(
        verbose_name="Правильный адрес", null=True, blank=True, default=False
    )

    def __str__(self):
        return f"{self.cart} - {self.recipient_name}"

    class Meta:
        verbose_name = "Данные получателя"
        verbose_name_plural = "Данные получателей"

    @property
    def delivery_time(self):
        """Подсчитывает время доставки."""

        delivery_time = datetime.now() + timedelta(hours=delta_hours)
        return delivery_time.replace(second=0, microsecond=0)
