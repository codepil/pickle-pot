from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal
from enum import Enum

class PaymentMethod(str, Enum):
    credit_card = "credit_card"
    debit_card = "debit_card"
    paypal = "paypal"
    apple_pay = "apple_pay"
    google_pay = "google_pay"

class PaymentProcessor(str, Enum):
    stripe = "stripe"
    paypal = "paypal"
    square = "square"

class TransactionStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    success = "success"
    failed = "failed"
    cancelled = "cancelled"
    refunded = "refunded"
    partially_refunded = "partially_refunded"

class RefundReason(str, Enum):
    requested_by_customer = "requested_by_customer"
    out_of_stock = "out_of_stock"
    damaged = "damaged"
    quality_issue = "quality_issue"
    wrong_item = "wrong_item"

class RefundStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"

# Payment Transaction schemas
class PaymentTransactionBase(BaseModel):
    transaction_id: str = Field(..., max_length=255)
    payment_method: PaymentMethod
    payment_processor: PaymentProcessor
    status: TransactionStatus
    amount: Decimal = Field(..., ge=0, decimal_places=2)
    fee_amount: Decimal = Field(0, ge=0, decimal_places=2)
    currency: str = Field("USD", max_length=3)
    card_last_four: Optional[str] = Field(None, max_length=4)
    card_brand: Optional[str] = Field(None, max_length=20)
    processor_response: Optional[str] = None
    failure_reason: Optional[str] = Field(None, max_length=255)
    reference_number: Optional[str] = Field(None, max_length=255)

class PaymentTransactionCreate(PaymentTransactionBase):
    order_id: str

class PaymentTransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None
    processor_response: Optional[str] = None
    failure_reason: Optional[str] = Field(None, max_length=255)
    reference_number: Optional[str] = Field(None, max_length=255)
    processed_at: Optional[datetime] = None

class PaymentTransaction(PaymentTransactionBase):
    id: str
    order_id: str
    processed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Refund schemas
class RefundBase(BaseModel):
    amount: Decimal = Field(..., ge=0, decimal_places=2)
    reason: RefundReason
    notes: Optional[str] = None
    refund_transaction_id: str = Field(..., max_length=255)

class RefundCreate(RefundBase):
    order_id: str
    payment_transaction_id: str
    processed_by: Optional[str] = None

class RefundUpdate(BaseModel):
    status: Optional[RefundStatus] = None
    notes: Optional[str] = None
    processed_at: Optional[datetime] = None

class Refund(RefundBase):
    id: str
    order_id: str
    payment_transaction_id: str
    status: RefundStatus
    processed_by: Optional[str] = None
    processed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Payment Process Request (simplified for API usage)
class PaymentProcessRequest(BaseModel):
    order_id: str
    amount: Decimal = Field(..., ge=0, decimal_places=2)
    payment_method: PaymentMethod
    payment_processor: PaymentProcessor = PaymentProcessor.stripe
    currency: str = Field("USD", max_length=3)

# Payment Intent (for Stripe integration)
class PaymentIntentCreate(BaseModel):
    order_id: str
    amount: Decimal = Field(..., ge=0, decimal_places=2)
    currency: str = Field("USD", max_length=3)
    payment_method_id: Optional[str] = None
    customer_id: Optional[str] = None
    metadata: Optional[dict] = None

class PaymentIntentResponse(BaseModel):
    payment_intent_id: str
    client_secret: str
    status: str
    amount: Decimal
    currency: str

    class Config:
        from_attributes = True

# Payment confirmation
class PaymentConfirmation(BaseModel):
    payment_intent_id: str
    status: TransactionStatus
    transaction_id: str
    amount: Decimal
    fee_amount: Decimal = 0
    processor_response: Optional[str] = None
    failure_reason: Optional[str] = None

# Refund request
class RefundRequest(BaseModel):
    order_id: str
    amount: Decimal = Field(..., ge=0, decimal_places=2)
    reason: RefundReason
    notes: Optional[str] = None

# Payment analytics
class PaymentAnalytics(BaseModel):
    total_transactions: int
    total_volume: Decimal
    successful_transactions: int
    failed_transactions: int
    refunded_transactions: int
    average_transaction_amount: Decimal
    total_fees: Decimal
    payment_methods_breakdown: dict[str, int]
    processor_breakdown: dict[str, int]

    class Config:
        from_attributes = True

# Payment method for user profiles
class UserPaymentMethodCreate(BaseModel):
    stripe_payment_method_id: str = Field(..., max_length=255)
    type: str = Field(..., max_length=50)
    last4: str = Field(..., max_length=4)
    brand: Optional[str] = Field(None, max_length=50)
    expiry_month: Optional[int] = Field(None, ge=1, le=12)
    expiry_year: Optional[int] = Field(None, ge=2024)
    is_default: bool = False
    billing_address_id: Optional[str] = None

class UserPaymentMethod(UserPaymentMethodCreate):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
