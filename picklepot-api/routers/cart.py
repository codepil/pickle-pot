from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
from decimal import Decimal
import uuid

from core.database import get_db
from core.auth import get_current_user
from models.user import User
from models.cart import CartSession, CartItem
from models.product import Product, ProductVariant
from schemas.cart import CartSummary, AddToCartRequest, UpdateCartItemRequest
from schemas.common import MessageResponse

router = APIRouter()

def get_or_create_cart_session(db: Session, user: Optional[User] = None, session_token: Optional[str] = None) -> CartSession:
    """Get existing cart session or create new one"""
    session = None

    if user:
        # For authenticated users, find by user_id
        session = db.query(CartSession).filter(
            CartSession.user_id == user.id,
            CartSession.expires_at > datetime.utcnow()
        ).first()
    elif session_token:
        # For guest users, find by session_token
        session = db.query(CartSession).filter(
            CartSession.session_token == session_token,
            CartSession.expires_at > datetime.utcnow()
        ).first()

    if not session:
        # Create new session
        session = CartSession(
            user_id=user.id if user else None,
            session_token=session_token or str(uuid.uuid4()),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db.add(session)
        db.commit()
        db.refresh(session)

    return session

@router.get("/", response_model=CartSummary)
async def get_cart(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
    session_token: Optional[str] = None
):
    """Get user's cart"""
    cart_session = get_or_create_cart_session(db, current_user, session_token)

    # Calculate totals
    subtotal = Decimal('0.00')
    item_count = 0

    for item in cart_session.items:
        if item.variant and item.variant.price:
            subtotal += item.variant.price * item.quantity
            item_count += item.quantity

    # Placeholder tax and shipping calculations
    estimated_tax = subtotal * Decimal('0.08')  # 8% tax
    estimated_shipping = Decimal('5.99') if subtotal < Decimal('50.00') else Decimal('0.00')
    estimated_total = subtotal + estimated_tax + estimated_shipping

    return CartSummary(
        session_id=str(cart_session.id),
        items=cart_session.items,
        item_count=item_count,
        subtotal=subtotal,
        estimated_tax=estimated_tax,
        estimated_shipping=estimated_shipping,
        estimated_total=estimated_total,
        expires_at=cart_session.expires_at
    )

@router.post("/items", status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    request: AddToCartRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
    session_token: Optional[str] = None
):
    """Add item to cart"""
    # Verify product variant exists
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == request.product_variant_id,
        ProductVariant.is_active == True
    ).first()

    if not variant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product variant not found"
        )

    cart_session = get_or_create_cart_session(db, current_user, session_token)

    # Check if item already exists in cart
    existing_item = db.query(CartItem).filter(
        CartItem.cart_session_id == cart_session.id,
        CartItem.product_variant_id == request.product_variant_id
    ).first()

    if existing_item:
        # Update quantity
        existing_item.quantity += request.quantity
        existing_item.preferred_delivery_date = request.preferred_delivery_date
        existing_item.special_instructions = request.special_instructions
        existing_item.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # Create new cart item
        cart_item = CartItem(
            cart_session_id=cart_session.id,
            product_id=variant.product_id,
            product_variant_id=request.product_variant_id,
            quantity=request.quantity,
            preferred_delivery_date=request.preferred_delivery_date,
            special_instructions=request.special_instructions
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item

@router.put("/items/{itemId}")
async def update_cart_item(
    itemId: str,
    request: dict,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Update cart item"""
    # Placeholder implementation
    return {
        "id": itemId,
        "productVariantId": "1",
        "productName": "Mango Pickle",
        "productSlug": "mango-pickle",
        "variantName": "6oz Jar",
        "sku": "MP001-6OZ",
        "price": 12.99,
        "quantity": request.get("quantity", 1),
        "imageUrl": "",
        "preferredDeliveryDate": request.get("preferredDeliveryDate"),
        "specialInstructions": request.get("specialInstructions"),
        "addedAt": "2024-01-15T10:30:00Z"
    }

@router.delete("/items/{itemId}", response_model=MessageResponse)
async def remove_cart_item(
    itemId: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Remove item from cart"""
    # Placeholder implementation
    return MessageResponse(message="Item removed from cart")

@router.delete("/clear", response_model=MessageResponse)
async def clear_cart(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Clear all items from cart"""
    # Placeholder implementation
    return MessageResponse(message="Cart cleared successfully")
