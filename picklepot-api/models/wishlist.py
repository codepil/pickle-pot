from sqlalchemy import Column, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    variant_id = Column(UUID(as_uuid=True), ForeignKey("product_variants.id"), nullable=True)
    added_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product", back_populates="wishlist_items")
    variant = relationship("ProductVariant", back_populates="wishlist_items")

    __table_args__ = (
        Index('idx_wishlist_user_product', user_id, product_id, variant_id, unique=True),
        Index('idx_wishlist_user', user_id),
        Index('idx_wishlist_product', product_id),
    )
