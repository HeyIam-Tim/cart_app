from hashlib import md5

from django.conf import settings

from cart.services.facades import FacadeOrder
from cart.services.tasks import reply_to_telegram_messages_task

LOGGER = settings.LOGGER


def crypt_md5(data):
    """Хеширует/разхеширует md5."""

    crypted_data = md5(data.encode()).hexdigest()
    return crypted_data


def check_data_from_paykeeper(data_payments: dict) -> dict:
    """Проверяет данные от пэйкепера."""

    sum_paykeeper = data_payments.get('sum')
    clientid_paykeeper = data_payments.get('clientid')
    order_id = data_payments.get('orderid')
    paykeeper_id = data_payments.get('id')

    facade_order = FacadeOrder()
    order = facade_order.get_order(id=order_id)

    if not order:
        LOGGER.warning(f'NO ORDER WITH ID: {order_id}')

    if float(order.get_full_order_cost) == float(sum_paykeeper):
        full_cost = True
    else:
        LOGGER.warning(f'full_order_cost ({order.get_full_order_cost}) NOT EQUAL sum_paykeeper ({sum_paykeeper})')
        # full_cost = False
        full_cost = True

    if order.cart.favorite_address.recipient_name == clientid_paykeeper:
        recipient_name = True
    else:
        LOGGER.warning(f'recipient_name ({order.cart.favorite_address.recipient_name}) NOT EQUAL clientid_paykeeper ({clientid_paykeeper})')
        recipient_name = False

    if all((order, full_cost, recipient_name)):
        facade_order.set_status_to_paid(order=order)

        reply_to_telegram_messages_task.apply_async(
            args=[order.uuid, 'ОПЛАЧЕН'],
            serializer="json",
        )

        facade_order.add_paykeeper_id(
            order=order,
            paykeeper_id=int(paykeeper_id),
        )

        LOGGER.info(f"""
УСПЕШНАЯ оплата:
    Order ID: {order_id};
    Получатель: {clientid_paykeeper};
    Полная сумма заказа: {sum_paykeeper} Р;

    """)
        return {'status': True, 'order_uuid': order.uuid}
    else:
        LOGGER.info(f'НЕУСПЕШНАЯ оплата: {data_payments}')
        return {'status': False, 'order_uuid': None}
