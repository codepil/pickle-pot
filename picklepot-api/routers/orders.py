from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
import math

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

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create new order"""
    # Placeholder implementation
    return {
        "id": "order2",
        "orderNumber": "ORD-2024-002",
        "userId": str(current_user.id),
        "status": "pending",
        "paymentStatus": "pending",
        "fulfillmentStatus": "unfulfilled",
        "customerEmail": current_user.email,
        "customerPhone": current_user.phone,
        "subtotal": 25.98,
        "taxAmount": 2.08,
        "shippingAmount": 5.99,
        "discountAmount": 0,
        "totalAmount": 34.05,
        "currency": "USD",
        "createdAt": "2024-01-15T12:00:00Z"
    }

@router.get("/{orderId}")
async def get_order(
    orderId: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get order details"""
    # Placeholder implementation
    return {
        "id": orderId,
        "orderNumber": "ORD-2024-001",
        "userId": str(current_user.id),
        "status": "delivered",
        "paymentStatus": "paid",
        "fulfillmentStatus": "fulfilled",
        "customerEmail": current_user.email,
        "customerPhone": current_user.phone,
        "subtotal": 25.98,
        "taxAmount": 2.08,
        "shippingAmount": 5.99,
        "discountAmount": 0,
        "totalAmount": 34.05,
        "currency": "USD",
        "items": [
            {
                "id": "item1",
                "productVariantId": "1",
                "productName": "Mango Pickle",
                "productSku": "MP001-6OZ",
                "variantName": "6oz Jar",
                "quantity": 2,
                "unitPrice": 12.99,
                "totalPrice": 25.98,
                "productWeight": 170,
                "productImageUrl": ""
            }
        ],
        "timeline": [
            {
                "event": "Order placed",
                "description": "Order has been successfully placed",
                "timestamp": "2024-01-10T10:00:00Z"
            },
            {
                "event": "Order confirmed",
                "description": "Order has been confirmed and is being prepared",
                "timestamp": "2024-01-10T10:15:00Z"
            },
            {
                "event": "Order shipped",
                "description": "Order has been shipped",
                "timestamp": "2024-01-11T14:30:00Z"
            },
            {
                "event": "Order delivered",
                "description": "Order has been delivered",
                "timestamp": "2024-01-13T16:20:00Z"
            }
        ],
        "createdAt": "2024-01-10T10:00:00Z"
    }

@router.post("/{orderId}/cancel", response_model=MessageResponse)
async def cancel_order(
    orderId: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel order"""
    # Placeholder implementation
    return MessageResponse(message="Order cancelled successfully")

@router.get("/{orderId}/tracking")
async def get_order_tracking(
    orderId: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get order tracking information"""
    # Placeholder implementation
    return {
        "orderId": orderId,
        "trackingNumber": "1Z999AA1234567890",
        "carrier": "UPS",
        "status": "delivered",
        "estimatedDelivery": "2024-01-13",
        "trackingUrl": "https://www.ups.com/track?loc=en_US&tracknum=1Z999AA1234567890",
        "events": [
            {
                "event": "Package delivered",
                "location": "Front door",
                "timestamp": "2024-01-13T16:20:00Z"
            },
            {
                "event": "Out for delivery",
                "location": "Local facility",
                "timestamp": "2024-01-13T08:00:00Z"
            },
            {
                "event": "In transit",
                "location": "Distribution center",
                "timestamp": "2024-01-12T10:30:00Z"
            }
        ]
    }
