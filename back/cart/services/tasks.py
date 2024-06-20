from django.contrib.auth.models import User
from django.conf import settings
from django.core.cache import cache
from celery import shared_task

from cart.models import Delivery, CartItem
from core.service.helper_services import add_commission

LOGGER = settings.LOGGER


@shared_task
def send_order_signal_to_telegram(order_uuid: str) -> None:
    """
        Отправляет сигнал о создании заказа в телеграм.
    """

    from core.service.facades import FacadeUser
    from cart.services.facades import FacadeOrder

    bot_seller = settings.BOT_SELLER
    # PAID = 4
    DELIVERY_TYPE_PICKUP = 3

    facade_order = FacadeOrder()
    order = facade_order.get_order_by_order_uuid(order_uuid=order_uuid)
    if not order:
        return None

    deliveries = Delivery.objects.filter(
        order__uuid=str(order_uuid),
        # order__status=PAID,
        )

    order_message = f'Заказ №{order.id}\nСумма заказа: {order.get_total_cost}Р\n{len(deliveries)} доставки\n'  # NOQA

    telegram_tag = ''
    if FacadeUser.check_telegram_user(user=order.cart.user):
        telegram_tag = f'\nТелеграм для связи: @{order.cart.user.username}'

    # Габариты: 43*54*90, не более 150 см в сумме
    # Вес: не более 30 кг

    TEXT_FOR_DELIVERY = ("""
Доставка №{delivery_count}
Адрес отправителя: {shop_address}
Имя отправителя: {delivery_shop_name}
Телефон отправителя: {delivery_phone_from}{receiver_data}

Состав доставки: {product_list}
Товары в доставке на сумму: {items_total_cost}
Тип доставки: {delivery_type}
Стоимость доставки: {delivery_cost}Р{passport_data}
///////////////////////////////////
    """)

    RECEIVER_DATA = ("""
\nАдрес получателя: {delivery_address}
Телефон получателя: {delivery_phone}{telegram_tag}
Имя получателя: {credentials}{porch}{floor}{appartment}{door_code}""")

    if deliveries:
        for index, delivery in enumerate(deliveries, start=1):

            porch = f'\nПодъезд: {delivery.recipient_address.porch}' if delivery.recipient_address.porch else ''
            floor = f'\nЭтаж: {delivery.recipient_address.floor}' if delivery.recipient_address.floor else ''
            appartment = f'\nКвартира: {delivery.recipient_address.appartment}' if delivery.recipient_address.appartment else ''
            door_code = f'\nДомофон: {delivery.recipient_address.door_code}' if delivery.recipient_address.door_code else ''

            if delivery.delivery_type == DELIVERY_TYPE_PICKUP:
                passport = delivery.user_passport
                passport_data = f'\n\nДанные для доверенности:\nФИО: {passport.full_name}\nСерия Номер: {passport.series_number_unhashed}\nКем выдан: {passport.issuer}\nДата выдачи: {passport.date_of_issue}'

                receiver_data = ''
            else:
                receiver_data = RECEIVER_DATA.format(
                    delivery_address=delivery.receiver_address,
                    delivery_phone=delivery.receiver_phone,
                    telegram_tag=telegram_tag,
                    credentials=delivery.receiver_name,
                    porch=porch,
                    floor=floor,
                    appartment=appartment,
                    door_code=door_code,
                )

                passport_data = ''

            product_list = [
                f'\nНаименование: {item.product_name}\nАртикул: {item.article}\nБренд: {item.brand}\nКоличество: {item.cart_item_quantity}шт;\nЦена за шт: {item.price} Р\n' for item in delivery.cart_items.all()]  # NOQA

            text_message = TEXT_FOR_DELIVERY.format(
                delivery_count=delivery.id,
                shop_address=delivery.sender_address,
                delivery_shop_name=delivery.sender_name,
                delivery_phone_from=delivery.sender_phone,

                passport_data=passport_data,

                receiver_data=receiver_data,

                credentials=delivery.receiver_name,
                product_list=''.join(product_list),
                items_total_cost=delivery.get_total_cost,
                delivery_type=delivery.get_delivery_type_display(),
                delivery_cost=delivery.delivery_cost,
            )
            order_message += text_message

        order_message += f'\nСтатус: {str(order.get_status_display()).upper()}'

        telegram_messages = ''
        for chat in settings.TELEGRAM_RECEIVERS:
            try:
                message = bot_seller.send_message(
                    chat_id=chat,
                    text=order_message,
                )
            except Exception as er:
                LOGGER.warning(f'ERROR сообщение не отправлено - CHAT_ID:{chat}, ORDER_DATA: {order_message}, ERROR_MSG: {er}')
                continue
            else:
                telegram_messages += f'{chat},{message.message_id} '

        facade_order.save_telegram_messages(
            telegram_messages=telegram_messages,
            order=order,
        )

    return


@shared_task
def reply_to_telegram_messages_task(order_uuid: str, status: str) -> None:
    """Отвечает на телеграм сообщения"""

    from cart.services.facades import FacadeOrder

    facade_order = FacadeOrder()
    order = facade_order.get_order_by_order_uuid(order_uuid=order_uuid)

    bot_seller = settings.BOT_SELLER

    for telegram_message in order.telegram_messages:
        bot_seller.send_message(
            chat_id=telegram_message.chat_id,
            text=f'Статус: {status}',
            reply_to_message_id=telegram_message.message_id,
        )

    return None


@shared_task
def task_delivery_cancellation_to_telegram(
        delivery_id: int,
        yandex_delivery_id: str,
        action: str,
        ) -> None:
    """
        Отправляет сигнал о событиях для доставки в телеграм.
    """

    from cart.services.facades import FacadeDelivery
    facade_delivery = FacadeDelivery()
    delivery = facade_delivery.get_delivery(id=delivery_id)

    bot_seller = settings.BOT_SELLER

    if action == 'CANCELL':
        TEXT_FOR_DELIVERY_CANCELLATION = ("""
Доставка №{delivery_id}.
Яндекс ID: {yandex_delivery_id}.
Действие: ОТМЕНА.
        """)

    if action == 'RETURN':
        TEXT_FOR_DELIVERY_CANCELLATION = ("""
Доставка №{delivery_id}.
Яндекс ID: {yandex_delivery_id}.
Действие: ВОЗВРАТ.
Стоимость товаров в доставке: {order_cost} P.
Стоимость доставки: {delivery_cost} P.
        """)

    text_message = TEXT_FOR_DELIVERY_CANCELLATION.format(
        delivery_id=delivery_id,
        yandex_delivery_id=yandex_delivery_id,
        action=action,
        order_cost=delivery.order_cost,
        delivery_cost=delivery.delivery_cost,
    )
    for chat in settings.TELEGRAM_RECEIVERS:
        bot_seller.send_message(
            chat_id=chat,
            text=text_message,
        )


def set_cart_item_data(
        cart_item_data_to_update: dict,
        cart_item: CartItem,
        ) -> CartItem:
    """Устанавливает обновленные данные для позиции."""

    CHECKBOX = 2

    if not cart_item_data_to_update:
        # cart_item.price = 0
        # # cart_item.cart_item_quantity = 0
        # cart_item.max_quantity = 0
        # cart_item.delivery_period = 0
        pass

    else:
        cart_item_quantity = cart_item_data_to_update.get('max_quantity')
        if cart_item.get_cart_item_quantity_int() >= int(cart_item_quantity):
            cart_item.cart_item_quantity = cart_item_quantity

        cart_item.old_price = float(cart_item.price)

        new_price = float(cart_item_data_to_update.get('price'))
        price_with_commision = add_commission(price=new_price)
        cart_item.price = price_with_commision

        cart_item.max_quantity = cart_item_quantity
        cart_item.delivery_period = cart_item_data_to_update.get(
            'delivery_period')

    cart_item.state = CHECKBOX
    cart_item.save()
    return cart_item


def check_cart_item_id(offers: list, cart_item_id: str) -> dict:
    """Сверяет cart_item_id и unique_offer_id."""

    cart_item_data_to_update = {}

    offers_generator = (item for item in offers)
    for offer in offers_generator:
        unique_offer_id = str(offer.get('unique_offer_id')).upper()
        if unique_offer_id == str(cart_item_id).upper():
            cart_item_data = {
                'price': offer.get('price'),
                'max_quantity': offer.get('quantity'),
                'delivery_period': offer.get('delivery_period'),
                }
            cart_item_data_to_update = cart_item_data
            return cart_item_data_to_update

    return cart_item_data_to_update


def recalculate_cart_item_helper(
        cart_id_list: list,
        user_id: int,
        city_id: int,
        ) -> None:

    """Обновляет данные для позиции корзины."""

    from cart.services.facades import FacadeCartItem
    from core.service.facades import FacadeOffers

    facade_cart_item = FacadeCartItem()
    facade_offers = FacadeOffers()
    user = User.objects.filter(id=int(user_id)).first()
    LOGGER.info(f'cart_id_list: {cart_id_list}')
    for cart_item_id in cart_id_list:
        cart_item = facade_cart_item.get_cart_item_by_id(
            id=cart_item_id,
            )

        offers = facade_offers.get_offers_no_websocket(
            product_name=cart_item.product_name,
            search_article=cart_item.article,
            search_brand=cart_item.brand,
            search_city_id=city_id,
            user=user,
            )

        cart_item_data_to_update = check_cart_item_id(
            offers=offers,
            cart_item_id=cart_item.cart_item_id,
            )

        set_cart_item_data(
            cart_item_data_to_update=cart_item_data_to_update,
            cart_item=cart_item,
            )


def recalculate_cart_item():
    """Цикл для обновления позиций корзины."""

    while True:
        recalculate_cart_items_dict = cache.get('RECALCULATE_CART_ITEMS_DICT')

        if len(recalculate_cart_items_dict.keys()) == 1:
            cache.delete('RECALCULATE_CART_ITEMS_DICT')
            break

        try:
            RECALCULATE_TIMEOUT = 43200
            data_to_recalculate = recalculate_cart_items_dict.popitem()[1]
            cache.set(
                'RECALCULATE_CART_ITEMS_DICT',
                recalculate_cart_items_dict,
                RECALCULATE_TIMEOUT,
                )

            recalculate_cart_item_helper(
                cart_id_list=[data_to_recalculate.get('cart_item_id')],
                city_id=data_to_recalculate.get('city_id'),
                user_id=data_to_recalculate.get('user_id'),
                )

        except KeyError as er:
            LOGGER.warning(f'{er}')
            cache.delete('RECALCULATE_CART_ITEMS_DICT')
            break
    return


@shared_task
def task_recalculate_cart_item(
        cart_id_list: list,
        city_id: str,
        user_id: int,
        ) -> None:
    """
        Заново проценивает данные для позиции | task.
    """

    recalculate_cart_item_helper(
        cart_id_list=cart_id_list,
        city_id=city_id,
        user_id=user_id,
        )

    # recalculate_cart_item()
