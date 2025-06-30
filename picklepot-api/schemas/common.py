from pydantic import BaseModel
from typing import Optional, Any

class ErrorResponse(BaseModel):
    error: str
    message: str
    code: Optional[str] = None
    details: Optional[Any] = None

class MessageResponse(BaseModel):
    message: str

class Pagination(BaseModel):
    page: int
    limit: int
    total: int
    totalPages: int
    hasNext: bool
    hasPrev: bool

class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 20
    
    class Config:
        extra = "forbid"
