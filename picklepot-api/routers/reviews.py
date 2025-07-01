from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.auth import get_current_active_user
from models.user import User
from models.review import ProductReview
from models.product import Product
from models.order import Order, OrderItem
from schemas.review import ProductReviewCreate, ProductReview as ProductReviewSchema

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ProductReviewSchema)
async def create_review(
    request: ProductReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create product review"""
    # Verify product exists
    product = db.query(Product).filter(Product.id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Check if user already reviewed this product
    existing_review = db.query(ProductReview).filter(
        ProductReview.product_id == request.product_id,
        ProductReview.user_id == current_user.id
    ).first()

    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already reviewed this product"
        )

    # Check if it's a verified purchase
    is_verified_purchase = False
    if request.order_id:
        order_item = db.query(OrderItem).join(Order).filter(
            Order.id == request.order_id,
            Order.user_id == current_user.id,
            OrderItem.product_variant_id.in_(
                db.query(ProductVariant.id).filter(ProductVariant.product_id == request.product_id)
            )
        ).first()

        if order_item:
            is_verified_purchase = True

    # Create review
    review = ProductReview(
        product_id=request.product_id,
        user_id=current_user.id,
        order_id=request.order_id,
        rating=request.rating,
        title=request.title,
        review_text=request.review_text,
        is_verified_purchase=is_verified_purchase,
        is_approved=True  # Auto-approve for now
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review
