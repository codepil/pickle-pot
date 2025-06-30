from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db

router = APIRouter()

@router.post("/validate")
async def validate_coupon(request: dict, db: Session = Depends(get_db)):
    """Validate coupon code"""
    # Placeholder implementation
    code = request.get("code", "")
    if code == "WELCOME10":
        return {
            "valid": True,
            "coupon": {
                "id": "coupon1",
                "code": "WELCOME10",
                "name": "Welcome Discount",
                "description": "10% off your first order",
                "type": "percentage",
                "value": 10,
                "minimumOrderAmount": 20,
                "maximumDiscountAmount": 50
            },
            "discountAmount": 2.50,
            "message": "Coupon applied successfully"
        }
    else:
        return {
            "valid": False,
            "message": "Invalid coupon code"
        }
