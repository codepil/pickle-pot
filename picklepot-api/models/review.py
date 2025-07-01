from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, ForeignKey, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=True)  # Link to verified purchase
    rating = Column(Integer, nullable=False)
    title = Column(String(255), nullable=True)
    review_text = Column(Text, nullable=True)
    is_verified_purchase = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    helpful_count = Column(Integer, default=0)
    reported_count = Column(Integer, default=0)
    reviewer_name = Column(String(255), nullable=True)  # For anonymous reviews
    reviewer_email = Column(String(320), nullable=True)  # For anonymous reviews
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    order = relationship("Order")

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
        Index('idx_reviews_product', product_id),
        Index('idx_reviews_user', user_id),
        Index('idx_reviews_rating', rating),
        Index('idx_reviews_approved', is_approved),
        Index('idx_reviews_verified', is_verified_purchase),
        Index('idx_reviews_date', created_at),
        Index('idx_reviews_product_approved_rating', product_id, is_approved, rating),
    )
