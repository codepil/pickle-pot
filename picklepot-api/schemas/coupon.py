from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal
from enum import Enum

class CouponType(str, Enum):
    fixed_amount = "fixed_amount"
    percentage = "percentage"
    free_shipping = "free_shipping"

# Coupon schemas
class CouponBase(BaseModel):
    code: str = Field(..., max_length=50)
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    type: CouponType
    value: Decimal = Field(..., ge=0, decimal_places=2)
    minimum_order_amount: Decimal = Field(0, ge=0, decimal_places=2)
    maximum_discount_amount: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    usage_limit: Optional[int] = Field(None, ge=1)  # None = unlimited
    usage_limit_per_customer: int = Field(1, ge=1)
    is_active: bool = True
    starts_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    code: Optional[str] = Field(None, max_length=50)
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    type: Optional[CouponType] = None
    value: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    minimum_order_amount: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    maximum_discount_amount: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    usage_limit: Optional[int] = Field(None, ge=1)
    usage_limit_per_customer: Optional[int] = Field(None, ge=1)
    is_active: Optional[bool] = None
    starts_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

class Coupon(CouponBase):
    id: str
    usage_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Coupon Usage schemas
class CouponUsageBase(BaseModel):
    discount_amount: Decimal = Field(..., ge=0, decimal_places=2)

class CouponUsageCreate(CouponUsageBase):
    coupon_id: str
    order_id: str
    user_id: Optional[str] = None

class CouponUsage(CouponUsageBase):
    id: str
    coupon_id: str
    order_id: str
    user_id: Optional[str] = None
    used_at: datetime

    class Config:
        from_attributes = True

# Coupon validation
class CouponValidationRequest(BaseModel):
    code: str
    user_id: Optional[str] = None
    cart_total: Decimal = Field(..., ge=0, decimal_places=2)

class CouponValidationResponse(BaseModel):
    is_valid: bool
    coupon: Optional[Coupon] = None
    discount_amount: Decimal = Field(0, ge=0, decimal_places=2)
    error_message: Optional[str] = None
    error_code: Optional[str] = None

    class Config:
        from_attributes = True

# Coupon application
class CouponApplicationRequest(BaseModel):
    code: str
    order_total: Decimal = Field(..., ge=0, decimal_places=2)

class CouponApplicationResponse(BaseModel):
    applied: bool
    discount_amount: Decimal = Field(0, ge=0, decimal_places=2)
    new_total: Decimal = Field(..., ge=0, decimal_places=2)
    message: str

    class Config:
        from_attributes = True

# Coupon analytics
class CouponAnalytics(BaseModel):
    total_coupons: int
    active_coupons: int
    total_usage: int
    total_discount_given: Decimal
    most_used_coupons: list[dict]
    coupon_conversion_rate: float

    class Config:
        from_attributes = True

# Coupon performance
class CouponPerformance(BaseModel):
    coupon_id: str
    code: str
    name: str
    usage_count: int
    total_discount: Decimal
    conversion_rate: float
    average_order_value: Decimal

    class Config:
        from_attributes = True
