from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, Date, ForeignKey, Index
from sqlalchemy.types import DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class ShippingMethod(Base):
    __tablename__ = "shipping_methods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    carrier = Column(String(100), nullable=True)  # UPS, FedEx, USPS, etc.
    service_code = Column(String(50), nullable=True)  # Carrier's service code
    base_rate = Column(Decimal(10,2), nullable=False)
    rate_per_pound = Column(Decimal(10,2), default=0.00)
    free_shipping_threshold = Column(Decimal(10,2), nullable=True)  # Minimum order for free shipping
    max_weight = Column(Decimal(8,2), nullable=True)
    estimated_days_min = Column(Integer, default=1)
    estimated_days_max = Column(Integer, default=7)
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    shipments = relationship("Shipment", back_populates="shipping_method")

    __table_args__ = (
        Index('idx_shipping_methods_active', is_active),
        Index('idx_shipping_methods_order', display_order),
    )

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    shipping_method_id = Column(UUID(as_uuid=True), ForeignKey("shipping_methods.id"), nullable=False)
    tracking_number = Column(String(255), nullable=True, index=True)
    carrier = Column(String(100), nullable=False)
    status = Column(String(20), default='pending')  # pending, shipped, in_transit, delivered, exception, returned

    # Shipping details
    shipped_from_address = Column(Text, nullable=True)
    shipped_to_address = Column(Text, nullable=True)
    weight = Column(Decimal(8,2), nullable=True)
    length = Column(Decimal(8,2), nullable=True)
    width = Column(Decimal(8,2), nullable=True)
    height = Column(Decimal(8,2), nullable=True)

    # Shipping costs
    shipping_cost = Column(Decimal(10,2), nullable=False)
    insurance_cost = Column(Decimal(10,2), default=0.00)

    shipped_at = Column(DateTime, nullable=True)
    estimated_delivery_date = Column(Date, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="shipments")
    shipping_method = relationship("ShippingMethod", back_populates="shipments")

    __table_args__ = (
        Index('idx_shipments_order', order_id),
        Index('idx_shipments_status', status),
        Index('idx_shipments_delivery_date', estimated_delivery_date),
    )
