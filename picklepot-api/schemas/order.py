from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from enum import Enum

class OrderStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    refunded = "refunded"

class PaymentStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    partially_paid = "partially_paid"
    refunded = "refunded"
    partially_refunded = "partially_refunded"
    failed = "failed"

class FulfillmentStatus(str, Enum):
    unfulfilled = "unfulfilled"
    partial = "partial"
    fulfilled = "fulfilled"

# Address schemas for orders
class OrderAddress(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    address_line1: str = Field(..., max_length=255)
    address_line2: Optional[str] = Field(None, max_length=255)
    city: str = Field(..., max_length=100)
    state: str = Field(..., max_length=100)
    zip_code: str = Field(..., max_length=20)
    country: str = Field(..., max_length=100)
    phone: Optional[str] = Field(None, max_length=20)

class ShippingAddress(OrderAddress):
    delivery_instructions: Optional[str] = None

# Order Item schemas
class OrderItemBase(BaseModel):
    product_variant_id: str
    product_name: str = Field(..., max_length=255)
    product_sku: str = Field(..., max_length=100)
    variant_name: str = Field(..., max_length=255)
    quantity: int = Field(..., ge=1)
    unit_price: Decimal = Field(..., ge=0, decimal_places=2)
    total_price: Decimal = Field(..., ge=0, decimal_places=2)
    product_weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    product_image_url: Optional[str] = Field(None, max_length=500)

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: str
    order_id: str

    class Config:
        from_attributes = True

# Order schemas
class OrderBase(BaseModel):
    customer_email: EmailStr
    customer_phone: Optional[str] = Field(None, max_length=20)
    
    # Billing address
    billing_first_name: str = Field(..., max_length=100)
    billing_last_name: str = Field(..., max_length=100)
    billing_address_line1: str = Field(..., max_length=255)
    billing_address_line2: Optional[str] = Field(None, max_length=255)
    billing_city: str = Field(..., max_length=100)
    billing_state: str = Field(..., max_length=100)
    billing_zip_code: str = Field(..., max_length=20)
    billing_country: str = Field(..., max_length=100)
    
    # Shipping address
    shipping_first_name: str = Field(..., max_length=100)
    shipping_last_name: str = Field(..., max_length=100)
    shipping_address_line1: str = Field(..., max_length=255)
    shipping_address_line2: Optional[str] = Field(None, max_length=255)
    shipping_city: str = Field(..., max_length=100)
    shipping_state: str = Field(..., max_length=100)
    shipping_zip_code: str = Field(..., max_length=20)
    shipping_country: str = Field(..., max_length=100)
    shipping_phone: Optional[str] = Field(None, max_length=20)
    delivery_instructions: Optional[str] = None
    preferred_delivery_date: Optional[date] = None
    
    # Order totals
    subtotal: Decimal = Field(..., ge=0, decimal_places=2)
    tax_amount: Decimal = Field(..., ge=0, decimal_places=2)
    shipping_amount: Decimal = Field(..., ge=0, decimal_places=2)
    discount_amount: Decimal = Field(0, ge=0, decimal_places=2)
    total_amount: Decimal = Field(..., ge=0, decimal_places=2)
    
    currency: str = Field("USD", max_length=3)
    tax_rate: Decimal = Field(0.08, ge=0, le=1, decimal_places=4)

class OrderCreate(OrderBase):
    user_id: Optional[str] = None
    items: List[OrderItemCreate]
    coupon_code: Optional[str] = None
    payment_method_id: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    fulfillment_status: Optional[FulfillmentStatus] = None
    tracking_number: Optional[str] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    delivery_instructions: Optional[str] = None
    preferred_delivery_date: Optional[date] = None

class Order(OrderBase):
    id: str
    order_number: str
    user_id: Optional[str] = None
    status: OrderStatus
    payment_status: PaymentStatus
    fulfillment_status: FulfillmentStatus
    
    confirmed_at: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

class OrderListItem(BaseModel):
    id: str
    order_number: str
    status: OrderStatus
    payment_status: PaymentStatus
    total_amount: Decimal
    created_at: datetime
    customer_name: str
    customer_email: EmailStr
    item_count: int
    total_quantity: int

    class Config:
        from_attributes = True

# Checkout schemas
class CheckoutRequest(BaseModel):
    cart_session_id: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    billing_address: OrderAddress
    shipping_address: ShippingAddress
    shipping_method_id: str
    payment_method_id: Optional[str] = None
    coupon_code: Optional[str] = None
    save_addresses: bool = False
    marketing_emails_consent: bool = False

class CheckoutResponse(BaseModel):
    order_id: str
    order_number: str
    payment_intent_id: Optional[str] = None
    client_secret: Optional[str] = None
    total_amount: Decimal
    requires_payment_confirmation: bool = False

    class Config:
        from_attributes = True

# Order status update
class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    notes: Optional[str] = None
    notify_customer: bool = True

# Order search filters
class OrderSearchFilters(BaseModel):
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    fulfillment_status: Optional[FulfillmentStatus] = None
    customer_email: Optional[str] = None
    order_number: Optional[str] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None

# Order analytics
class OrderAnalytics(BaseModel):
    total_orders: int
    total_revenue: Decimal
    average_order_value: Decimal
    orders_by_status: dict[str, int]
    revenue_by_month: dict[str, Decimal]
    top_selling_products: List[dict]

    class Config:
        from_attributes = True
