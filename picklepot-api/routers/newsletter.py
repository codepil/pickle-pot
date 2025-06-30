from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.common import MessageResponse

router = APIRouter()

@router.post("/subscribe", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def subscribe_newsletter(request: dict, db: Session = Depends(get_db)):
    """Subscribe to newsletter"""
    # Placeholder implementation
    return MessageResponse(message="Successfully subscribed to newsletter")

@router.post("/unsubscribe", response_model=MessageResponse)
async def unsubscribe_newsletter(request: dict, db: Session = Depends(get_db)):
    """Unsubscribe from newsletter"""
    # Placeholder implementation
    return MessageResponse(message="Successfully unsubscribed from newsletter")
