from sqlalchemy import Column, String, Integer, DateTime, Text, Date, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class CartSession(Base):
    __tablename__ = "cart_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    session_token = Column(String(255), nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="cart_sessions")
    items = relationship("CartItem", back_populates="session", cascade="all, delete-orphan")

    __table_args__ = (
        Index('idx_cart_sessions_user', user_id),
        Index('idx_cart_sessions_expires', expires_at),
    )

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cart_session_id = Column(UUID(as_uuid=True), ForeignKey("cart_sessions.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    product_variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    preferred_delivery_date = Column(Date, nullable=True)
    special_instructions = Column(Text, nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    session = relationship("CartSession", back_populates="items")
    product = relationship("Product", back_populates="cart_items")
    variant = relationship("ProductVariant", back_populates="cart_items")

    __table_args__ = (
        Index('idx_cart_items_session_variant', cart_session_id, product_variant_id, unique=True),
        Index('idx_cart_items_session', cart_session_id),
        Index('idx_cart_items_product', product_id),
    )
