from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class PriceSchema(BaseModel):
    """Схема цены."""

    price: str = Field(alias='total_price_with_vat')
    ratio: float = Field(alias='surge_ratio')
    currency: str


class BasePriceSchema(BaseModel):
    """Base Схема цены."""

    price_schema: PriceSchema = Field(alias='price')
    description: str


class DeliveryPriceListSchema(BaseModel):
    """Схемы цен."""

    offers: Optional[list[BasePriceSchema]] = None
    code: Optional[str] = None


class DeliveryTimeSchema(BaseModel):
    """Время забора и окончания доставки."""

    pickup_to: datetime = None
    delivery_to: datetime = None
