from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from core.database import get_db
from models.product import Category, Product
from schemas.product import Category as CategorySchema
from schemas.common import MessageResponse

router = APIRouter()

@router.get("/", response_model=List[CategorySchema])
async def get_categories(db: Session = Depends(get_db)):
    """Get all product categories"""
    categories = db.query(Category).filter(
        Category.is_active == True
    ).order_by(Category.display_order, Category.name).all()

    return categories

@router.get("/{categoryId}", response_model=CategorySchema)
async def get_category(categoryId: str, db: Session = Depends(get_db)):
    """Get category by ID"""
    category = db.query(Category).filter(
        Category.id == categoryId,
        Category.is_active == True
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    return category
