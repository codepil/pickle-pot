from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Index
from sqlalchemy.types import DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=False)
    location = Column(String(100), default='main_warehouse')
    quantity_available = Column(Integer, nullable=False, default=0)
    quantity_reserved = Column(Integer, nullable=False, default=0)  # Items in pending orders
    quantity_committed = Column(Integer, nullable=False, default=0)  # Items in confirmed orders
    reorder_level = Column(Integer, default=10)
    reorder_quantity = Column(Integer, default=50)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    variant = relationship("ProductVariant", back_populates="inventory")

    __table_args__ = (
        Index('idx_inventory_variant_location', product_variant_id, location, unique=True),
        Index('idx_inventory_location', location),
        Index('idx_inventory_available', quantity_available),
        Index('idx_inventory_reorder', reorder_level),
    )

class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=False)
    location = Column(String(100), default='main_warehouse')
    movement_type = Column(String(20), nullable=False)  # purchase, sale, adjustment, transfer, return, damage
    quantity = Column(Integer, nullable=False)  # Positive for stock in, negative for stock out
    reference_type = Column(String(20), nullable=True)  # order, adjustment, purchase_order, return
    reference_id = Column(UUID(as_uuid=True), nullable=True)
    cost_per_unit = Column(Decimal(10,2), nullable=True)
    notes = Column(Text, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    variant = relationship("ProductVariant", back_populates="inventory_movements")
    created_by_user = relationship("User", foreign_keys=[created_by])

    __table_args__ = (
        Index('idx_movements_variant', product_variant_id),
        Index('idx_movements_type', movement_type),
        Index('idx_movements_reference', reference_type, reference_id),
        Index('idx_movements_date', created_at),
    )
