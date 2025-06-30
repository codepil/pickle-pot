from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class ContactMethod(str, Enum):
    email = "email"
    phone = "phone"
    sms = "sms"

class ContactTime(str, Enum):
    morning = "morning"
    afternoon = "afternoon"
    evening = "evening"
    anytime = "anytime"

class AddressType(str, Enum):
    home = "home"
    work = "work"
    other = "other"

class Address(BaseModel):
    id: str
    type: AddressType
    isDefault: bool
    firstName: str
    lastName: str
    addressLine1: str
    addressLine2: Optional[str] = None
    city: str
    state: str
    zipCode: str
    country: str
    phone: Optional[str] = None
    deliveryInstructions: Optional[str] = None

class CreateAddressRequest(BaseModel):
    type: AddressType
    isDefault: bool = False
    firstName: str
    lastName: str
    addressLine1: str
    addressLine2: Optional[str] = None
    city: str
    state: str
    zipCode: str
    country: str = "United States"
    phone: Optional[str] = None
    deliveryInstructions: Optional[str] = None

class UpdateAddressRequest(BaseModel):
    type: Optional[AddressType] = None
    isDefault: Optional[bool] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    addressLine1: Optional[str] = None
    addressLine2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    deliveryInstructions: Optional[str] = None

class PaymentMethod(BaseModel):
    id: str
    type: str
    last4: str
    brand: str
    expiryMonth: int
    expiryYear: int
    isDefault: bool
    billingAddress: Address

class UserProfile(BaseModel):
    id: str
    email: EmailStr
    firstName: str
    lastName: str
    phone: Optional[str] = None
    dateOfBirth: Optional[str] = None
    preferredContactMethod: Optional[ContactMethod] = None
    preferredContactTime: Optional[ContactTime] = None
    addresses: List[Address] = []
    paymentMethods: List[PaymentMethod] = []
    createdAt: datetime

class UpdateProfileRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    dateOfBirth: Optional[str] = None
    preferredContactMethod: Optional[ContactMethod] = None
    preferredContactTime: Optional[ContactTime] = None
