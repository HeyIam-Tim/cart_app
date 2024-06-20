import requests

from cart.models import Order
from django.conf import settings

LOGGER = settings.LOGGER


class FacadeReceipts():
    """Фасад Чеки"""

    login_paykeeper = settings.LOGIN_PAYKEEPER
    password_paykeeper = settings.PASSWORD_PAYKEEPER

    method_post = 'post'
    method_get = 'get'

    status_success = 200

    pay_keeper_server_url = settings.SERVER_PAYKEEPER
    receipts_url = f'{pay_keeper_server_url}/info/receipts/bypaymentid/'

    def get_receipts_by_order_id(self, order_id: int) -> list:
        """Получает чеки по id заказа"""

        from cart.services.facades import FacadeOrder

        facade_order = FacadeOrder()
        order = facade_order.get_order(id=order_id)
        if not order:
            return []

        receipt_links = self.get_receipts(order=order)
        return receipt_links

    def get_receipts(self, order: Order) -> list:
        """Получает чеки"""

        response_py = self.request_receipts(
            method=self.method_get,
            order=order,
        )

        if not response_py:
            return []

        receipt_links = self.get_receipt_links(response_py=response_py)

        self.save_receipt_links(receipt_links=receipt_links, order=order)

        return receipt_links

    def request_receipts(self, method: str, order: Order) -> list:
        """Делает запрос на получение данных с чеками"""

        try:
            response = requests.request(
                method=method,
                url=self.receipts_url,
                params={'payment_id': order.paykeeper_id},
                auth=(self.login_paykeeper, self.password_paykeeper),
            )
        except Exception as er:
            LOGGER.warning(er)
            return []
        else:
            if response.status_code != self.status_success:
                LOGGER.warning(response.json())
                return []
            response_py = response.json()
        return response_py

    def get_receipt_links(self, response_py: list) -> list:
        """Формирует ссылки для чеков"""

        receipt_links = []
        for receipt in response_py:
            paykeer_inner_id = receipt.get('id')
            fop_receipt_key = receipt.get('fop_receipt_key')
            receipt_link = f'{self.pay_keeper_server_url}/receipt/{fop_receipt_key}/?rc_id={paykeer_inner_id}'
            receipt_links.append(receipt_link)

        return receipt_links

    def save_receipt_links(self, receipt_links: list, order: Order) -> None:
        """Сохраняет ссылки для чеков"""

        receipt_history = ''
        for receipt in receipt_links:
            receipt_history += f'{receipt}---'

        order.receipt_history = receipt_history
        order.save()
        return None
