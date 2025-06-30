from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from core.database import get_db
from core.auth import get_current_admin_user
from models.user import User

router = APIRouter()

@router.get("/products")
async def admin_get_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None)
):
    """Admin: Get all products"""
    # Placeholder implementation
    return {
        "products": [
            {
                "id": "1",
                "name": "Mango Pickle",
                "sku": "MP001",
                "price": 12.99,
                "quantity": 50,
                "isActive": True,
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 20,
            "total": 1,
            "totalPages": 1,
            "hasNext": False,
            "hasPrev": False
        }
    }

@router.get("/orders")
async def admin_get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status")
):
    """Admin: Get all orders"""
    # Placeholder implementation
    return {
        "orders": [
            {
                "id": "order1",
                "orderNumber": "ORD-2024-001",
                "customerEmail": "customer@example.com",
                "status": "delivered",
                "totalAmount": 34.05,
                "createdAt": "2024-01-10T10:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 20,
            "total": 1,
            "totalPages": 1,
            "hasNext": False,
            "hasPrev": False
        }
    }

@router.get("/inventory")
async def admin_get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    lowStock: Optional[bool] = Query(None)
):
    """Admin: Get inventory status"""
    # Placeholder implementation
    return {
        "items": [
            {
                "id": "1",
                "productName": "Mango Pickle",
                "sku": "MP001-6OZ",
                "currentStock": 50,
                "lowStockThreshold": 10,
                "isLowStock": False,
                "lastRestocked": "2024-01-01T00:00:00Z"
            }
        ]
    }

@router.get("/settings")
async def admin_get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Get application settings"""
    # Placeholder implementation
    return {
        "storeName": "The Pickle Pot",
        "storeEmail": "hello@thepicklepot.com",
        "currency": "USD",
        "taxRate": 0.08,
        "shippingSettings": {
            "freeShippingThreshold": 50,
            "standardShippingRate": 5.99
        }
    }
