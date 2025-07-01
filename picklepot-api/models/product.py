from sqlalchemy import Column, String, Boolean, DateTime, Text, Integer, JSON, ForeignKey, Index
from sqlalchemy.types import DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    parent = relationship("Category", remote_side="Category.id", back_populates="children")
    children = relationship("Category", back_populates="parent")
    products = relationship("Product", back_populates="category")

    __table_args__ = (
        Index('idx_categories_parent', parent_id),
        Index('idx_categories_active', is_active),
        Index('idx_categories_order', display_order),
    )

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False)
    sku = Column(String(100), unique=True, nullable=False, index=True)
    status = Column(String(20), default='active')  # active, inactive, discontinued
    featured = Column(Boolean, default=False)

    # Pricing for different sizes
    weight_6oz = Column(DECIMAL(8,2), nullable=True)
    weight_8oz = Column(DECIMAL(8,2), nullable=True)
    price_6oz = Column(DECIMAL(10,2), nullable=True)
    price_8oz = Column(DECIMAL(10,2), nullable=True)
    compare_price_6oz = Column(DECIMAL(10,2), nullable=True)
    compare_price_8oz = Column(DECIMAL(10,2), nullable=True)
    cost_price_6oz = Column(DECIMAL(10,2), nullable=True)
    cost_price_8oz = Column(DECIMAL(10,2), nullable=True)

    # Product details
    tax_category = Column(String(50), default='standard')
    requires_shipping = Column(Boolean, default=True)
    shipping_weight_6oz = Column(DECIMAL(8,2), nullable=True)
    shipping_weight_8oz = Column(DECIMAL(8,2), nullable=True)
    ingredients = Column(Text, nullable=True)
    allergen_info = Column(Text, nullable=True)
    nutritional_info = Column(JSON, nullable=True)
    storage_instructions = Column(Text, nullable=True)
    shelf_life_days = Column(Integer, nullable=True)
    origin_country = Column(String(100), nullable=True)
    manufacturer = Column(String(255), nullable=True)
    tags = Column(JSON, nullable=True)

    # SEO
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    badges = relationship("ProductBadge", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("ProductReview", back_populates="product")
    wishlist_items = relationship("WishlistItem", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")

    __table_args__ = (
        Index('idx_products_category', category_id),
        Index('idx_products_status', status),
        Index('idx_products_featured', featured),
        Index('idx_products_name', name),
    )

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="images")

    __table_args__ = (
        Index('idx_product_images_product', product_id),
        Index('idx_product_images_primary', product_id, is_primary),
        Index('idx_product_images_order', product_id, display_order),
    )

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    name = Column(String(255), nullable=False)  # e.g., "6oz Bottle", "8oz Bottle"
    sku = Column(String(100), unique=True, nullable=False, index=True)
    size = Column(String(50), nullable=False)  # "6oz", "8oz"
    price = Column(DECIMAL(10,2), nullable=False)
    compare_price = Column(DECIMAL(10,2), nullable=True)
    cost_price = Column(DECIMAL(10,2), nullable=True)
    weight = Column(DECIMAL(8,2), nullable=True)
    shipping_weight = Column(DECIMAL(8,2), nullable=True)
    barcode = Column(String(100), nullable=True)
    track_inventory = Column(Boolean, default=True)
    inventory_policy = Column(String(20), default='deny')  # deny, continue
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="variants")
    inventory = relationship("Inventory", back_populates="variant", uselist=False)
    inventory_movements = relationship("InventoryMovement", back_populates="variant")
    cart_items = relationship("CartItem", back_populates="variant")
    order_items = relationship("OrderItem", back_populates="variant")
    wishlist_items = relationship("WishlistItem", back_populates="variant")

    __table_args__ = (
        Index('idx_variants_product', product_id),
        Index('idx_variants_size', size),
        Index('idx_variants_active', is_active),
    )

class ProductBadge(Base):
    __tablename__ = "product_badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    badge_type = Column(String(20), nullable=False)  # best_seller, organic, hot, premium, new, sale, limited
    label = Column(String(100), nullable=False)
    color = Column(String(7), default='#f59e0b')  # Hex color
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="badges")

    __table_args__ = (
        Index('idx_badges_product', product_id),
        Index('idx_badges_type', badge_type),
        Index('idx_badges_active', is_active),
        Index('idx_badges_expires', expires_at),
    )
