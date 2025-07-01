from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from decimal import Decimal
from typing import Optional

from core.database import get_db
from core.auth import get_current_user
from models.user import User
from models.coupon import Coupon, CouponUsage
from schemas.coupon import CouponApplicationRequest, CouponApplicationResponse

router = APIRouter()

@router.post("/validate", response_model=CouponValidateResponse)
async def validate_coupon(
    request: CouponValidateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
    order_total: Optional[Decimal] = None
):
    """Validate coupon code"""
    coupon = db.query(Coupon).filter(
        Coupon.code == request.code.upper(),
        Coupon.is_active == True
    ).first()

    if not coupon:
        return CouponValidateResponse(
            valid=False,
            message="Invalid coupon code"
        )

    # Check if coupon is currently valid (date range)
    now = datetime.utcnow()
    if coupon.starts_at and coupon.starts_at > now:
        return CouponValidateResponse(
            valid=False,
            message="Coupon is not yet active"
        )

    if coupon.expires_at and coupon.expires_at < now:
        return CouponValidateResponse(
            valid=False,
            message="Coupon has expired"
        )

    # Check usage limits
    if coupon.usage_limit and coupon.usage_count >= coupon.usage_limit:
        return CouponValidateResponse(
            valid=False,
            message="Coupon usage limit reached"
        )

    # Check per-customer usage limit
    if current_user and coupon.usage_limit_per_customer:
        user_usage_count = db.query(CouponUsage).filter(
            CouponUsage.coupon_id == coupon.id,
            CouponUsage.user_id == current_user.id
        ).count()

        if user_usage_count >= coupon.usage_limit_per_customer:
            return CouponValidateResponse(
                valid=False,
                message="You have already used this coupon"
            )

    # Check minimum order amount
    if request.order_total and request.order_total < coupon.minimum_order_amount:
        return CouponValidateResponse(
            valid=False,
            message=f"Minimum order amount of ${coupon.minimum_order_amount} required"
        )

    # Calculate discount amount
    discount_amount = Decimal('0.00')
    if request.order_total:
        if coupon.type == 'fixed_amount':
            discount_amount = coupon.value
        elif coupon.type == 'percentage':
            discount_amount = request.order_total * (coupon.value / 100)

        # Apply maximum discount limit
        if coupon.maximum_discount_amount and discount_amount > coupon.maximum_discount_amount:
            discount_amount = coupon.maximum_discount_amount

        # Don't exceed order total
        if discount_amount > request.order_total:
            discount_amount = request.order_total

    return CouponValidateResponse(
        valid=True,
        coupon=coupon,
        discount_amount=discount_amount,
        message="Coupon applied successfully"
    )
