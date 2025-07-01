from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal

from .product import ProductListItem, ProductVariant

# Cart Session schemas
class CartSessionBase(BaseModel):
    session_token: str = Field(..., max_length=255)
    expires_at: datetime

class CartSessionCreate(CartSessionBase):
    user_id: Optional[str] = None

class CartSession(CartSessionBase):
    id: str
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Cart Item schemas
class CartItemBase(BaseModel):
    quantity: int = Field(1, ge=1, le=99)
    preferred_delivery_date: Optional[date] = None
    special_instructions: Optional[str] = None

class CartItemCreate(CartItemBase):
    product_id: str
    product_variant_id: str

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = Field(None, ge=1, le=99)
    preferred_delivery_date: Optional[date] = None
    special_instructions: Optional[str] = None

class CartItem(CartItemBase):
    id: str
    cart_session_id: str
    product_id: str
    product_variant_id: str
    added_at: datetime
    updated_at: datetime
    
    # Related data for display
    product: Optional[ProductListItem] = None
    variant: Optional[ProductVariant] = None

    class Config:
        from_attributes = True

# Cart summary with totals
class CartSummary(BaseModel):
    session_id: str
    items: List[CartItem]
    item_count: int
    subtotal: Decimal
    estimated_tax: Decimal
    estimated_shipping: Decimal
    estimated_total: Decimal
    expires_at: datetime

    class Config:
        from_attributes = True

# Add to cart request
class AddToCartRequest(BaseModel):
    product_variant_id: str
    quantity: int = Field(1, ge=1, le=99)
    preferred_delivery_date: Optional[date] = None
    special_instructions: Optional[str] = None

# Update cart item request
class UpdateCartItemRequest(BaseModel):
    quantity: Optional[int] = Field(None, ge=1, le=99)
    preferred_delivery_date: Optional[date] = None
    special_instructions: Optional[str] = None

# Cart merge request (for merging guest cart with user cart)
class CartMergeRequest(BaseModel):
    guest_session_token: str
    user_session_token: str

# Cart validation response
class CartValidationResponse(BaseModel):
    is_valid: bool
    errors: List[str] = []
    warnings: List[str] = []
    updated_items: List[CartItem] = []

    class Config:
        from_attributes = True
