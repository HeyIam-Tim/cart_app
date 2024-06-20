from django.conf import settings
from enum import Enum

from cart.models import Order, HistoryOrder

LOGGER = settings.LOGGER


class HistoryPoints(Enum):
    """Пункты истории"""

    NEW = 'Заказ создан'
    IN_PROCESS = 'Начало отгрузки'
    FINISHED = 'Заказ доставлен'
    CANCELLED = 'Заказ отменен'
    PAID = 'Заказ оплачен'


class FacadeHistoryOrder():
    """Фасад Истроии заказа"""

    model = HistoryOrder

    def handle_history_order(self, order: Order, status: str) -> HistoryOrder:
        """Работает с истроией заказа"""

        if not order:
            return order

        history_point_name = self.get_history_point(status=status)

        history_point = self.model.objects.create(
            order=order,
            history_point=history_point_name,
        )
        return history_point

    def get_history_point(self, status: str) -> str:
        """Получает пункт истории"""

        history_point = ''
        for point in HistoryPoints:
            if point.name == status:
                history_point = point.value
        return history_point
