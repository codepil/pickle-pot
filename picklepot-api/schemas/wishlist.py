from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from .product import ProductListItem, ProductVariant

# Wishlist schemas
class WishlistItemBase(BaseModel):
    product_id: str
    variant_id: Optional[str] = None

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistItem(WishlistItemBase):
    id: str
    user_id: str
    added_at: datetime
    
    # Related data for display
    product: Optional[ProductListItem] = None
    variant: Optional[ProductVariant] = None

    class Config:
        from_attributes = True

class WishlistResponse(BaseModel):
    items: list[WishlistItem]
    item_count: int

    class Config:
        from_attributes = True

# Add to wishlist request
class AddToWishlistRequest(BaseModel):
    product_id: str
    variant_id: Optional[str] = None

# Move to cart request
class MoveToCartRequest(BaseModel):
    wishlist_item_id: str
    quantity: int = 1
