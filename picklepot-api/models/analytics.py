from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(String(255), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    event_type = Column(String(20), nullable=False)  # page_view, product_view, add_to_cart, remove_from_cart, search, purchase
    page_url = Column(String(500), nullable=True)
    referrer_url = Column(String(500), nullable=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)
    search_term = Column(String(255), nullable=True)
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    country = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="analytics_events")
    product = relationship("Product")

    __table_args__ = (
        Index('idx_analytics_user', user_id),
        Index('idx_analytics_type', event_type),
        Index('idx_analytics_product', product_id),
        Index('idx_analytics_date', created_at),
    )

class NewsletterSubscription(Base):
    __tablename__ = "newsletter_subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(320), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    status = Column(String(20), default='pending')  # subscribed, unsubscribed, pending
    subscription_source = Column(String(100), nullable=True)  # website, checkout, etc.
    confirmed_at = Column(DateTime, nullable=True)
    unsubscribed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="newsletter_subscription")

    __table_args__ = (
        Index('idx_newsletter_status', status),
    )
