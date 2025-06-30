from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.auth import get_current_active_user
from models.user import User

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_review(
    request: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create product review"""
    # Placeholder implementation
    return {
        "id": "review123",
        "userId": str(current_user.id),
        "productId": request.get("productId"),
        "rating": request.get("rating"),
        "title": request.get("title"),
        "content": request.get("content"),
        "isVerifiedPurchase": True,
        "createdAt": "2024-01-15T12:00:00Z"
    }
