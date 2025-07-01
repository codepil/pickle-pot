from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

# Review schemas
class ProductReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    review_text: Optional[str] = None
    reviewer_name: Optional[str] = Field(None, max_length=255)
    reviewer_email: Optional[EmailStr] = None

class ProductReviewCreate(ProductReviewBase):
    product_id: str
    order_id: Optional[str] = None  # For verified purchases

class ProductReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    review_text: Optional[str] = None
    is_approved: Optional[bool] = None

class ProductReview(ProductReviewBase):
    id: str
    product_id: str
    user_id: Optional[str] = None
    order_id: Optional[str] = None
    is_verified_purchase: bool = False
    is_approved: bool = False
    helpful_count: int = 0
    reported_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProductReviewListItem(BaseModel):
    id: str
    rating: int
    title: Optional[str] = None
    review_text: Optional[str] = None
    reviewer_name: Optional[str] = None
    is_verified_purchase: bool = False
    helpful_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

# Review statistics
class ReviewStats(BaseModel):
    total_reviews: int
    average_rating: float
    rating_distribution: dict[int, int]  # {1: count, 2: count, ...}
    verified_reviews_count: int
    recent_reviews: list[ProductReviewListItem]

    class Config:
        from_attributes = True

# Review helpful action
class ReviewHelpfulRequest(BaseModel):
    is_helpful: bool

# Review report
class ReviewReportRequest(BaseModel):
    reason: str = Field(..., max_length=255)
    details: Optional[str] = None

# Review moderation
class ReviewModerationRequest(BaseModel):
    is_approved: bool
    moderation_notes: Optional[str] = None

# Review filters for listing
class ReviewFilters(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    verified_only: bool = False
    approved_only: bool = True
    order_by: str = Field("newest", pattern="^(newest|oldest|rating_high|rating_low|helpful)$")

# Review summary for product display
class ProductReviewSummary(BaseModel):
    product_id: str
    total_reviews: int
    average_rating: float
    rating_distribution: dict[int, int]
    recent_reviews: list[ProductReviewListItem]
    verified_purchase_percentage: float

    class Config:
        from_attributes = True
