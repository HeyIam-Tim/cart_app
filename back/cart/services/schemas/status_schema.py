from typing import Optional
from pydantic import BaseModel, Field


class StatusDeliverySchema(BaseModel):
    """Статус доставки | Схема."""

    yandex_delivery_id: str = Field(alias='id')
    status: str
    status_ru: Optional[str] = ''


class StatusDeliveryListSchema(BaseModel):
    """Список со статусами доставок | Схема."""

    delivery_statuses: list[StatusDeliverySchema]
