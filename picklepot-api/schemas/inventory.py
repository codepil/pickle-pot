from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
from enum import Enum

class MovementType(str, Enum):
    purchase = "purchase"
    sale = "sale"
    adjustment = "adjustment"
    transfer = "transfer"
    return_item = "return"
    damage = "damage"

class ReferenceType(str, Enum):
    order = "order"
    adjustment = "adjustment"
    purchase_order = "purchase_order"
    return_item = "return"

# Inventory schemas
class InventoryBase(BaseModel):
    location: str = Field("main_warehouse", max_length=100)
    quantity_available: int = Field(0, ge=0)
    quantity_reserved: int = Field(0, ge=0)
    quantity_committed: int = Field(0, ge=0)
    reorder_level: int = Field(10, ge=0)
    reorder_quantity: int = Field(50, ge=0)

class InventoryCreate(InventoryBase):
    product_variant_id: str

class InventoryUpdate(BaseModel):
    location: Optional[str] = Field(None, max_length=100)
    quantity_available: Optional[int] = Field(None, ge=0)
    quantity_reserved: Optional[int] = Field(None, ge=0)
    quantity_committed: Optional[int] = Field(None, ge=0)
    reorder_level: Optional[int] = Field(None, ge=0)
    reorder_quantity: Optional[int] = Field(None, ge=0)

class Inventory(InventoryBase):
    id: str
    product_variant_id: str
    updated_at: datetime

    class Config:
        from_attributes = True

# Inventory Movement schemas
class InventoryMovementBase(BaseModel):
    location: str = Field("main_warehouse", max_length=100)
    movement_type: MovementType
    quantity: int  # Positive for stock in, negative for stock out
    reference_type: Optional[ReferenceType] = None
    reference_id: Optional[str] = None
    cost_per_unit: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    notes: Optional[str] = None

class InventoryMovementCreate(InventoryMovementBase):
    product_variant_id: str
    created_by: Optional[str] = None

class InventoryMovement(InventoryMovementBase):
    id: str
    product_variant_id: str
    created_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Stock adjustment request
class StockAdjustmentRequest(BaseModel):
    product_variant_id: str
    location: str = Field("main_warehouse", max_length=100)
    quantity_change: int  # Positive or negative adjustment
    reason: str = Field(..., max_length=255)
    notes: Optional[str] = None

# Low stock alert response
class LowStockAlert(BaseModel):
    id: str
    product_variant_id: str
    product_name: str
    variant_name: str
    sku: str
    location: str
    current_quantity: int
    reorder_level: int
    reorder_quantity: int
    last_movement_date: Optional[datetime] = None

    class Config:
        from_attributes = True

# Inventory summary
class InventorySummary(BaseModel):
    total_products: int
    total_variants: int
    low_stock_count: int
    out_of_stock_count: int
    total_value: Decimal
    locations: list[str]

    class Config:
        from_attributes = True
