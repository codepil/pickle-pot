from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, ForeignKey, Index
from sqlalchemy.types import DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(20), nullable=False)  # fixed_amount, percentage, free_shipping
    value = Column(DECIMAL(10,2), nullable=False)
    minimum_order_amount = Column(DECIMAL(10,2), default=0.00)
    maximum_discount_amount = Column(DECIMAL(10,2), nullable=True)
    usage_limit = Column(Integer, nullable=True)  # NULL = unlimited
    usage_count = Column(Integer, default=0)
    usage_limit_per_customer = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    starts_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    usages = relationship("CouponUsage", back_populates="coupon")

    __table_args__ = (
        Index('idx_coupons_active', is_active),
        Index('idx_coupons_dates', starts_at, expires_at),
        Index('idx_coupons_usage', usage_count, usage_limit),
    )

class CouponUsage(Base):
    __tablename__ = "coupon_usage"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    coupon_id = Column(UUID(as_uuid=True), ForeignKey("coupons.id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    discount_amount = Column(Decimal(10,2), nullable=False)
    used_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    coupon = relationship("Coupon", back_populates="usages")
    order = relationship("Order", back_populates="coupon_usages")
    user = relationship("User", back_populates="coupon_usages")

    __table_args__ = (
        Index('idx_coupon_usage_coupon', coupon_id),
        Index('idx_coupon_usage_order', order_id),
        Index('idx_coupon_usage_user', user_id),
        Index('idx_coupon_usage_date', used_at),
    )
