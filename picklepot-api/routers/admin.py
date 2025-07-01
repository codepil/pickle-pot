from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import math

from core.database import get_db
from core.auth import get_current_admin_user
from models.user import User
from models.product import Product
from models.order import Order
from models.inventory import Inventory
from schemas.common import PaginationResponse

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
    query = db.query(Product)

    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.sku.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )

    # Order by created date (newest first)
    query = query.order_by(Product.created_at.desc())

    # Count total
    total = query.count()
    total_pages = math.ceil(total / limit)

    # Apply pagination
    products = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "products": products,
        "pagination": PaginationResponse(
            page=page,
            limit=limit,
            total=total,
            totalPages=total_pages,
            hasNext=page < total_pages,
            hasPrev=page > 1
        )
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
    query = db.query(Order)

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

@router.get("/inventory")
async def admin_get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    lowStock: Optional[bool] = Query(None)
):
    """Admin: Get inventory status"""
    from models.product import ProductVariant

    query = db.query(Inventory).join(ProductVariant).join(Product)

    # Filter for low stock if requested
    if lowStock:
        query = query.filter(Inventory.quantity <= Inventory.low_stock_threshold)

    inventory_items = query.all()

    return {"items": inventory_items}

@router.get("/settings")
async def admin_get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Get application settings"""
    # In a real implementation, these would come from a settings table
    # For now, return static settings
    return {
        "storeName": "The Pickle Pot",
        "storeEmail": "hello@thepicklepot.com",
        "currency": "USD",
        "taxRate": 0.08,
        "shippingSettings": {
            "freeShippingThreshold": 50.00,
            "standardShippingRate": 5.99
        }
    }
