from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.auth import get_current_active_user
from models.user import User
from models.wishlist import WishlistItem
from models.product import Product, ProductVariant
from schemas.wishlist import WishlistItem as WishlistItemSchema, WishlistItemCreate
from schemas.common import MessageResponse

router = APIRouter()

@router.get("/", response_model=List[WishlistItemSchema])
async def get_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user wishlist"""
    wishlist_items = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id
    ).order_by(WishlistItem.added_at.desc()).all()

    return wishlist_items

@router.post("/items", status_code=status.HTTP_201_CREATED, response_model=WishlistItemSchema)
async def add_to_wishlist(
    request: WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add item to wishlist"""
    # Verify product exists
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Verify variant exists if provided
    if request.variant_id:
        variant = db.query(ProductVariant).filter(
            ProductVariant.id == request.variant_id,
            ProductVariant.product_id == request.product_id
        ).first()
        if not variant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product variant not found"
            )

    # Check if item is already in wishlist
    existing_item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == request.product_id,
        WishlistItem.variant_id == request.variant_id
    ).first()

    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Item already in wishlist"
        )

    # Create wishlist item
    wishlist_item = WishlistItem(
        user_id=current_user.id,
        product_id=request.product_id,
        variant_id=request.variant_id
    )

    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)

    return wishlist_item

@router.delete("/items/{itemId}", response_model=MessageResponse)
async def remove_from_wishlist(
    itemId: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Remove item from wishlist"""
    wishlist_item = db.query(WishlistItem).filter(
        WishlistItem.id == itemId,
        WishlistItem.user_id == current_user.id
    ).first()

    if not wishlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist item not found"
        )

    db.delete(wishlist_item)
    db.commit()

    return MessageResponse(message="Item removed from wishlist")
