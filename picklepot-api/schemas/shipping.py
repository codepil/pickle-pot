from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from decimal import Decimal
from enum import Enum

class ShipmentStatus(str, Enum):
    pending = "pending"
    shipped = "shipped"
    in_transit = "in_transit"
    delivered = "delivered"
    exception = "exception"
    returned = "returned"

# Shipping Method schemas
class ShippingMethodBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    carrier: Optional[str] = Field(None, max_length=100)
    service_code: Optional[str] = Field(None, max_length=50)
    base_rate: Decimal = Field(..., ge=0, decimal_places=2)
    rate_per_pound: Decimal = Field(0, ge=0, decimal_places=2)
    free_shipping_threshold: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    max_weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    estimated_days_min: int = Field(1, ge=1)
    estimated_days_max: int = Field(7, ge=1)
    is_active: bool = True
    display_order: int = 0

class ShippingMethodCreate(ShippingMethodBase):
    pass

class ShippingMethodUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    carrier: Optional[str] = Field(None, max_length=100)
    service_code: Optional[str] = Field(None, max_length=50)
    base_rate: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    rate_per_pound: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    free_shipping_threshold: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    max_weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    estimated_days_min: Optional[int] = Field(None, ge=1)
    estimated_days_max: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class ShippingMethod(ShippingMethodBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Shipment schemas
class ShipmentBase(BaseModel):
    tracking_number: Optional[str] = Field(None, max_length=255)
    carrier: str = Field(..., max_length=100)
    status: ShipmentStatus = ShipmentStatus.pending
    shipped_from_address: Optional[str] = None
    shipped_to_address: Optional[str] = None
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    length: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    width: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    height: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipping_cost: Decimal = Field(..., ge=0, decimal_places=2)
    insurance_cost: Decimal = Field(0, ge=0, decimal_places=2)
    estimated_delivery_date: Optional[date] = None

class ShipmentCreate(ShipmentBase):
    order_id: str
    shipping_method_id: str

class ShipmentUpdate(BaseModel):
    tracking_number: Optional[str] = Field(None, max_length=255)
    status: Optional[ShipmentStatus] = None
    shipped_from_address: Optional[str] = None
    shipped_to_address: Optional[str] = None
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    length: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    width: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    height: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipping_cost: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    insurance_cost: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipped_at: Optional[datetime] = None
    estimated_delivery_date: Optional[date] = None
    delivered_at: Optional[datetime] = None

class Shipment(ShipmentBase):
    id: str
    order_id: str
    shipping_method_id: str
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    # Related data
    shipping_method: Optional[ShippingMethod] = None

    class Config:
        from_attributes = True

# Shipping calculation request
class ShippingCalculationRequest(BaseModel):
    items: list[dict]  # List of cart items with weights
    destination_zip: str = Field(..., max_length=20)
    destination_country: str = Field("United States", max_length=100)
    total_weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)

# Shipping rate response
class ShippingRate(BaseModel):
    shipping_method_id: str
    name: str
    description: Optional[str] = None
    carrier: Optional[str] = None
    rate: Decimal
    estimated_days_min: int
    estimated_days_max: int
    is_free: bool = False

    class Config:
        from_attributes = True

# Tracking information
class TrackingEvent(BaseModel):
    date: datetime
    status: str
    description: str
    location: Optional[str] = None

class TrackingInfo(BaseModel):
    tracking_number: str
    carrier: str
    status: ShipmentStatus
    shipped_at: Optional[datetime] = None
    estimated_delivery_date: Optional[date] = None
    delivered_at: Optional[datetime] = None
    events: list[TrackingEvent] = []

    class Config:
        from_attributes = True

# Shipping label request
class ShippingLabelRequest(BaseModel):
    shipment_id: str
    from_address: dict
    to_address: dict
    package_info: dict
    service_type: str

# Shipping analytics
class ShippingAnalytics(BaseModel):
    total_shipments: int
    shipped_orders: int
    delivered_orders: int
    average_delivery_time: float
    shipping_methods_usage: dict[str, int]
    carriers_performance: dict[str, dict]
    total_shipping_revenue: Decimal
    average_shipping_cost: Decimal

    class Config:
        from_attributes = True
