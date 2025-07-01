from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from decimal import Decimal
from datetime import datetime
from enum import Enum

class ProductStatus(str, Enum):
    active = "active"
    inactive = "inactive"
    discontinued = "discontinued"

class BadgeType(str, Enum):
    best_seller = "best_seller"
    organic = "organic"
    hot = "hot"
    premium = "premium"
    new = "new"
    sale = "sale"
    limited = "limited"

# Category schemas
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=100)
    description: Optional[str] = None
    parent_id: Optional[str] = None
    display_order: int = 0
    is_active: bool = True
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    slug: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None

class Category(CategoryBase):
    id: str
    created_at: datetime
    updated_at: datetime
    children: List['Category'] = []

    class Config:
        from_attributes = True

# Product Image schemas
class ProductImageBase(BaseModel):
    image_url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    display_order: int = 0
    is_primary: bool = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImage(ProductImageBase):
    id: str
    product_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Product Variant schemas
class ProductVariantBase(BaseModel):
    name: str = Field(..., max_length=255)
    sku: str = Field(..., max_length=100)
    size: str = Field(..., max_length=50)
    price: Decimal = Field(..., ge=0, decimal_places=2)
    compare_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    cost_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipping_weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    barcode: Optional[str] = Field(None, max_length=100)
    track_inventory: bool = True
    inventory_policy: str = Field("deny", pattern="^(deny|continue)$")
    display_order: int = 0
    is_active: bool = True

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    sku: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    compare_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    cost_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipping_weight: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    barcode: Optional[str] = Field(None, max_length=100)
    track_inventory: Optional[bool] = None
    inventory_policy: Optional[str] = Field(None, pattern="^(deny|continue)$")
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class ProductVariant(ProductVariantBase):
    id: str
    product_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Product Badge schemas
class ProductBadgeBase(BaseModel):
    badge_type: BadgeType
    label: str = Field(..., max_length=100)
    color: str = Field("#f59e0b", pattern="^#[0-9A-Fa-f]{6}$")
    display_order: int = 0
    is_active: bool = True
    expires_at: Optional[datetime] = None

class ProductBadgeCreate(ProductBadgeBase):
    pass

class ProductBadge(ProductBadgeBase):
    id: str
    product_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    category_id: str
    sku: str = Field(..., max_length=100)
    status: ProductStatus = ProductStatus.active
    featured: bool = False
    
    # Pricing for different sizes
    weight_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    weight_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    compare_price_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    compare_price_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    cost_price_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    cost_price_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    
    # Product details
    tax_category: str = Field("standard", max_length=50)
    requires_shipping: bool = True
    shipping_weight_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipping_weight_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    ingredients: Optional[str] = None
    allergen_info: Optional[str] = None
    nutritional_info: Optional[Dict[str, Any]] = None
    storage_instructions: Optional[str] = None
    shelf_life_days: Optional[int] = Field(None, ge=0)
    origin_country: Optional[str] = Field(None, max_length=100)
    manufacturer: Optional[str] = Field(None, max_length=255)
    tags: Optional[List[str]] = None
    
    # SEO
    seo_title: Optional[str] = Field(None, max_length=255)
    seo_description: Optional[str] = None

class ProductCreate(ProductBase):
    images: Optional[List[ProductImageCreate]] = []
    variants: Optional[List[ProductVariantCreate]] = []
    badges: Optional[List[ProductBadgeCreate]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    category_id: Optional[str] = None
    sku: Optional[str] = Field(None, max_length=100)
    status: Optional[ProductStatus] = None
    featured: Optional[bool] = None
    
    # Pricing for different sizes
    weight_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    weight_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    compare_price_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    compare_price_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    cost_price_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    cost_price_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    
    # Product details
    tax_category: Optional[str] = Field(None, max_length=50)
    requires_shipping: Optional[bool] = None
    shipping_weight_6oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    shipping_weight_8oz: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    ingredients: Optional[str] = None
    allergen_info: Optional[str] = None
    nutritional_info: Optional[Dict[str, Any]] = None
    storage_instructions: Optional[str] = None
    shelf_life_days: Optional[int] = Field(None, ge=0)
    origin_country: Optional[str] = Field(None, max_length=100)
    manufacturer: Optional[str] = Field(None, max_length=255)
    tags: Optional[List[str]] = None
    
    # SEO
    seo_title: Optional[str] = Field(None, max_length=255)
    seo_description: Optional[str] = None

class Product(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime
    category: Category
    images: List[ProductImage] = []
    variants: List[ProductVariant] = []
    badges: List[ProductBadge] = []

    class Config:
        from_attributes = True

class ProductListItem(BaseModel):
    id: str
    name: str
    slug: str
    short_description: Optional[str] = None
    price_6oz: Optional[Decimal] = None
    price_8oz: Optional[Decimal] = None
    compare_price_6oz: Optional[Decimal] = None
    compare_price_8oz: Optional[Decimal] = None
    featured: bool
    status: ProductStatus
    category: Category
    primary_image: Optional[ProductImage] = None
    badges: List[ProductBadge] = []

    class Config:
        from_attributes = True

# Update forward references
Category.model_rebuild()
