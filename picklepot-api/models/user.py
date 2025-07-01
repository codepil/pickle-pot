from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    date_of_birth = Column(String(10), nullable=True)  # YYYY-MM-DD format
    preferred_contact_method = Column(String(20), nullable=True)
    preferred_contact_time = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    reset_password_token = Column(String(255), nullable=True)
    reset_password_expires = Column(DateTime, nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    payment_methods = relationship("PaymentMethod", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")
    cart_sessions = relationship("CartSession", back_populates="user")
    reviews = relationship("ProductReview", back_populates="user")
    wishlist_items = relationship("WishlistItem", back_populates="user")
    coupon_usages = relationship("CouponUsage", back_populates="user")
    analytics_events = relationship("AnalyticsEvent", back_populates="user")
    newsletter_subscription = relationship("NewsletterSubscription", back_populates="user", uselist=False)
    blog_posts = relationship("BlogPost", back_populates="author")

class Address(Base):
    __tablename__ = "user_addresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(String(20), nullable=False)  # home, work, other
    is_default = Column(Boolean, default=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    zip_code = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    delivery_instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="addresses")

class PaymentMethod(Base):
    __tablename__ = "user_payment_methods"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    stripe_payment_method_id = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # card, bank_account, etc.
    last4 = Column(String(4), nullable=False)
    brand = Column(String(50), nullable=True)  # visa, mastercard, etc.
    expiry_month = Column(Integer, nullable=True)
    expiry_year = Column(Integer, nullable=True)
    is_default = Column(Boolean, default=False)
    billing_address_id = Column(UUID(as_uuid=True), ForeignKey("user_addresses.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="payment_methods")
