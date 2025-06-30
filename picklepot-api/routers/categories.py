from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from schemas.common import MessageResponse

router = APIRouter()

@router.get("/")
async def get_categories(db: Session = Depends(get_db)):
    """Get all product categories"""
    # Placeholder implementation
    return {
        "categories": [
            {
                "id": "1",
                "name": "Pickles",
                "slug": "pickles",
                "description": "Traditional Indian pickles",
                "imageUrl": "",
                "parentId": None,
                "sortOrder": 1,
                "isActive": True,
                "productCount": 15
            },
            {
                "id": "2", 
                "name": "Spice Powders",
                "slug": "spice-powders",
                "description": "Fresh ground spice powders",
                "imageUrl": "",
                "parentId": None,
                "sortOrder": 2,
                "isActive": True,
                "productCount": 12
            }
        ]
    }

@router.get("/{categoryId}")
async def get_category(categoryId: str, db: Session = Depends(get_db)):
    """Get category by ID"""
    # Placeholder implementation
    if categoryId == "1":
        return {
            "id": "1",
            "name": "Pickles",
            "slug": "pickles", 
            "description": "Traditional Indian pickles",
            "imageUrl": "",
            "parentId": None,
            "sortOrder": 1,
            "isActive": True,
            "productCount": 15
        }
    else:
        raise HTTPException(status_code=404, detail="Category not found")
