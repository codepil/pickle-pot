from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
import math
from datetime import datetime

from core.database import get_db
from core.auth import get_current_active_user
from models.user import User
from models.order import Order, OrderItem
from schemas.order import Order as OrderSchema, OrderCreate
from schemas.common import MessageResponse, PaginationResponse

router = APIRouter()

@router.get("/")
async def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status")
):
    """Get user orders"""
    query = db.query(Order).filter(Order.user_id == current_user.id)

    # Apply status filter
    if status_filter:
        query = query.filter(Order.status == status_filter)

    # Order by created date (newest first)
    query = query.order_by(Order.created_at.desc())

    # Count total
    total = query.count()
    total_pages = math.ceil(total / limit)

    # Apply pagination
    orders = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "orders": orders,
        "pagination": PaginationResponse(
            page=page,
            limit=limit,
            total=total,
            totalPages=total_pages,
            hasNext=page < total_pages,
            hasPrev=page > 1
        )
    }

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=OrderSchema)
async def create_order(
    request: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create new order"""
    import secrets
    import string

    # Generate order number
    order_number = f"ORD-{datetime.now().year}-{''.join(secrets.choices(string.ascii_uppercase + string.digits, k=6))}"

    # Create order
    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        customer_email=request.customer_email,
        customer_phone=request.customer_phone,
        billing_first_name=request.billing_first_name,
        billing_last_name=request.billing_last_name,
        billing_address_line1=request.billing_address_line1,
        billing_address_line2=request.billing_address_line2,
        billing_city=request.billing_city,
        billing_state=request.billing_state,
        billing_zip_code=request.billing_zip_code,
        billing_country=request.billing_country,
        shipping_first_name=request.shipping_first_name,
        shipping_last_name=request.shipping_last_name,
        shipping_address_line1=request.shipping_address_line1,
        shipping_address_line2=request.shipping_address_line2,
        shipping_city=request.shipping_city,
        shipping_state=request.shipping_state,
        shipping_zip_code=request.shipping_zip_code,
        shipping_country=request.shipping_country,
        shipping_phone=request.shipping_phone,
        delivery_instructions=request.delivery_instructions,
        preferred_delivery_date=request.preferred_delivery_date,
        subtotal=request.subtotal,
        tax_amount=request.tax_amount,
        shipping_amount=request.shipping_amount,
        discount_amount=request.discount_amount,
        total_amount=request.total_amount
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # Add order items if provided
    if hasattr(request, 'items') and request.items:
        for item_data in request.items:
            order_item = OrderItem(
                order_id=order.id,
                **item_data.dict()
            )
            db.add(order_item)

    db.commit()
    db.refresh(order)

    return order

@router.get("/{orderId}", response_model=OrderSchema)
async def get_order(
    orderId: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get order details"""
    order = db.query(Order).filter(
        Order.id == orderId,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return order

@router.post("/{orderId}/cancel", response_model=MessageResponse)
async def cancel_order(
    orderId: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel order"""
    order = db.query(Order).filter(
        Order.id == orderId,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Check if order can be cancelled
    if order.status in ['shipped', 'delivered', 'cancelled']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order cannot be cancelled in current status"
        )

    # Update order status
    order.status = 'cancelled'
    order.cancelled_at = datetime.utcnow()
    db.commit()

    return MessageResponse(message="Order cancelled successfully")

@router.get("/{orderId}/tracking")
async def get_order_tracking(
    orderId: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get order tracking information"""
    from models.shipping import Shipment

    order = db.query(Order).filter(
        Order.id == orderId,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Get shipment information
    shipment = db.query(Shipment).filter(Shipment.order_id == orderId).first()

    if not shipment:
        return {
            "orderId": orderId,
            "status": "not_shipped",
            "message": "Order has not been shipped yet"
        }

    return {
        "orderId": orderId,
        "trackingNumber": shipment.tracking_number,
        "carrier": shipment.carrier,
        "status": shipment.status,
        "estimatedDelivery": shipment.estimated_delivery_date,
        "trackingUrl": shipment.tracking_url,
        "shippedAt": shipment.shipped_at,
        "deliveredAt": shipment.delivered_at
    }
