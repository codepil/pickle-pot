from sqlalchemy import Column, String, Integer, DateTime, Text, Date, ForeignKey, Index
from sqlalchemy.types import DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default='pending')  # pending, confirmed, processing, shipped, delivered, cancelled, refunded
    payment_status = Column(String(20), default='pending')  # pending, paid, partially_paid, refunded, partially_refunded, failed
    fulfillment_status = Column(String(20), default='unfulfilled')  # unfulfilled, partial, fulfilled

    # Customer information (stored here for historical accuracy)
    customer_email = Column(String(320), nullable=False)
    customer_phone = Column(String(20), nullable=True)

    # Billing address
    billing_first_name = Column(String(100), nullable=False)
    billing_last_name = Column(String(100), nullable=False)
    billing_address_line1 = Column(String(255), nullable=False)
    billing_address_line2 = Column(String(255), nullable=True)
    billing_city = Column(String(100), nullable=False)
    billing_state = Column(String(100), nullable=False)
    billing_zip_code = Column(String(20), nullable=False)
    billing_country = Column(String(100), nullable=False)

    # Shipping address
    shipping_first_name = Column(String(100), nullable=False)
    shipping_last_name = Column(String(100), nullable=False)
    shipping_address_line1 = Column(String(255), nullable=False)
    shipping_address_line2 = Column(String(255), nullable=True)
    shipping_city = Column(String(100), nullable=False)
    shipping_state = Column(String(100), nullable=False)
    shipping_zip_code = Column(String(20), nullable=False)
    shipping_country = Column(String(100), nullable=False)
    shipping_phone = Column(String(20), nullable=True)
    delivery_instructions = Column(Text, nullable=True)
    preferred_delivery_date = Column(Date, nullable=True)

    # Order totals
    subtotal = Column(DECIMAL(10,2), nullable=False, default=0.00)
    tax_amount = Column(DECIMAL(10,2), nullable=False, default=0.00)
    shipping_amount = Column(DECIMAL(10,2), nullable=False, default=0.00)
    discount_amount = Column(DECIMAL(10,2), nullable=False, default=0.00)
    total_amount = Column(DECIMAL(10,2), nullable=False, default=0.00)

    # Currency and locale
    currency = Column(String(3), default='USD')
    tax_rate = Column(DECIMAL(5,4), default=0.0800)  # 8% tax rate

    # Timestamps
    confirmed_at = Column(DateTime, nullable=True)
    shipped_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("PaymentTransaction", back_populates="order")
    shipments = relationship("Shipment", back_populates="order")
    refunds = relationship("Refund", back_populates="order")
    coupon_usages = relationship("CouponUsage", back_populates="order")

    __table_args__ = (
        Index('idx_orders_user', user_id),
        Index('idx_orders_status', status),
        Index('idx_orders_payment_status', payment_status),
        Index('idx_orders_email', customer_email),
        Index('idx_orders_date', created_at),
        Index('idx_orders_delivery_date', preferred_delivery_date),
        Index('idx_orders_user_status_date', user_id, status, created_at),
    )

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=False)
    product_name = Column(String(255), nullable=False)  # Snapshot for historical accuracy
    product_sku = Column(String(100), nullable=False)
    variant_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10,2), nullable=False)
    total_price = Column(DECIMAL(10,2), nullable=False)

    # Product snapshot data
    product_weight = Column(DECIMAL(8,2), nullable=True)
    product_image_url = Column(String(500), nullable=True)

    # Relationships
    order = relationship("Order", back_populates="items")
    variant = relationship("ProductVariant", back_populates="order_items")

    __table_args__ = (
        Index('idx_order_items_order', order_id),
        Index('idx_order_items_product', product_variant_id),
    )
