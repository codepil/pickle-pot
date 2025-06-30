from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.auth import get_current_active_user
from models.user import User, Address, PaymentMethod
from schemas.user import (
    UserProfile, UpdateProfileRequest, Address as AddressSchema,
    CreateAddressRequest, UpdateAddressRequest,
    PaymentMethod as PaymentMethodSchema
)
from schemas.common import MessageResponse

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    # Convert addresses
    addresses = [
        AddressSchema(
            id=str(addr.id),
            type=addr.type,
            isDefault=addr.is_default,
            firstName=addr.first_name,
            lastName=addr.last_name,
            addressLine1=addr.address_line1,
            addressLine2=addr.address_line2,
            city=addr.city,
            state=addr.state,
            zipCode=addr.zip_code,
            country=addr.country,
            phone=addr.phone,
            deliveryInstructions=addr.delivery_instructions
        ) for addr in current_user.addresses
    ]
    
    # Convert payment methods
    payment_methods = [
        PaymentMethodSchema(
            id=str(pm.id),
            type=pm.type,
            last4=pm.last4,
            brand=pm.brand or "",
            expiryMonth=pm.expiry_month or 0,
            expiryYear=pm.expiry_year or 0,
            isDefault=pm.is_default,
            billingAddress=AddressSchema(
                id="",
                type="home",
                isDefault=False,
                firstName="",
                lastName="",
                addressLine1="",
                city="",
                state="",
                zipCode="",
                country=""
            )  # Simplified for now
        ) for pm in current_user.payment_methods
    ]
    
    return UserProfile(
        id=str(current_user.id),
        email=current_user.email,
        firstName=current_user.first_name,
        lastName=current_user.last_name,
        phone=current_user.phone,
        dateOfBirth=current_user.date_of_birth,
        preferredContactMethod=current_user.preferred_contact_method,
        preferredContactTime=current_user.preferred_contact_time,
        addresses=addresses,
        paymentMethods=payment_methods,
        createdAt=current_user.created_at
    )

@router.put("/profile", response_model=UserProfile)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    # Update fields if provided
    if request.firstName is not None:
        current_user.first_name = request.firstName
    if request.lastName is not None:
        current_user.last_name = request.lastName
    if request.phone is not None:
        current_user.phone = request.phone
    if request.dateOfBirth is not None:
        current_user.date_of_birth = request.dateOfBirth
    if request.preferredContactMethod is not None:
        current_user.preferred_contact_method = request.preferredContactMethod
    if request.preferredContactTime is not None:
        current_user.preferred_contact_time = request.preferredContactTime
    
    db.commit()
    db.refresh(current_user)
    
    # Return updated profile
    return await get_profile(current_user)

@router.get("/addresses", response_model=List[AddressSchema])
async def get_addresses(current_user: User = Depends(get_current_active_user)):
    """Get user addresses"""
    return [
        AddressSchema(
            id=str(addr.id),
            type=addr.type,
            isDefault=addr.is_default,
            firstName=addr.first_name,
            lastName=addr.last_name,
            addressLine1=addr.address_line1,
            addressLine2=addr.address_line2,
            city=addr.city,
            state=addr.state,
            zipCode=addr.zip_code,
            country=addr.country,
            phone=addr.phone,
            deliveryInstructions=addr.delivery_instructions
        ) for addr in current_user.addresses
    ]

@router.post("/addresses", response_model=AddressSchema, status_code=status.HTTP_201_CREATED)
async def create_address(
    request: CreateAddressRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create new address"""
    # If this is the default address, unset others
    if request.isDefault:
        for addr in current_user.addresses:
            addr.is_default = False
    
    address = Address(
        user_id=current_user.id,
        type=request.type,
        is_default=request.isDefault,
        first_name=request.firstName,
        last_name=request.lastName,
        address_line1=request.addressLine1,
        address_line2=request.addressLine2,
        city=request.city,
        state=request.state,
        zip_code=request.zipCode,
        country=request.country,
        phone=request.phone,
        delivery_instructions=request.deliveryInstructions
    )
    
    db.add(address)
    db.commit()
    db.refresh(address)
    
    return AddressSchema(
        id=str(address.id),
        type=address.type,
        isDefault=address.is_default,
        firstName=address.first_name,
        lastName=address.last_name,
        addressLine1=address.address_line1,
        addressLine2=address.address_line2,
        city=address.city,
        state=address.state,
        zipCode=address.zip_code,
        country=address.country,
        phone=address.phone,
        deliveryInstructions=address.delivery_instructions
    )

@router.get("/addresses/{addressId}", response_model=AddressSchema)
async def get_address(
    addressId: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific address"""
    address = db.query(Address).filter(
        Address.id == addressId,
        Address.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    return AddressSchema(
        id=str(address.id),
        type=address.type,
        isDefault=address.is_default,
        firstName=address.first_name,
        lastName=address.last_name,
        addressLine1=address.address_line1,
        addressLine2=address.address_line2,
        city=address.city,
        state=address.state,
        zipCode=address.zip_code,
        country=address.country,
        phone=address.phone,
        deliveryInstructions=address.delivery_instructions
    )

@router.put("/addresses/{addressId}", response_model=AddressSchema)
async def update_address(
    addressId: str,
    request: UpdateAddressRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update address"""
    address = db.query(Address).filter(
        Address.id == addressId,
        Address.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    # Update fields if provided
    if request.type is not None:
        address.type = request.type
    if request.isDefault is not None:
        address.is_default = request.isDefault
        # If setting as default, unset others
        if request.isDefault:
            for addr in current_user.addresses:
                if addr.id != address.id:
                    addr.is_default = False
    if request.firstName is not None:
        address.first_name = request.firstName
    if request.lastName is not None:
        address.last_name = request.lastName
    if request.addressLine1 is not None:
        address.address_line1 = request.addressLine1
    if request.addressLine2 is not None:
        address.address_line2 = request.addressLine2
    if request.city is not None:
        address.city = request.city
    if request.state is not None:
        address.state = request.state
    if request.zipCode is not None:
        address.zip_code = request.zipCode
    if request.country is not None:
        address.country = request.country
    if request.phone is not None:
        address.phone = request.phone
    if request.deliveryInstructions is not None:
        address.delivery_instructions = request.deliveryInstructions
    
    db.commit()
    db.refresh(address)
    
    return AddressSchema(
        id=str(address.id),
        type=address.type,
        isDefault=address.is_default,
        firstName=address.first_name,
        lastName=address.last_name,
        addressLine1=address.address_line1,
        addressLine2=address.address_line2,
        city=address.city,
        state=address.state,
        zipCode=address.zip_code,
        country=address.country,
        phone=address.phone,
        deliveryInstructions=address.delivery_instructions
    )

@router.delete("/addresses/{addressId}", response_model=MessageResponse)
async def delete_address(
    addressId: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete address"""
    address = db.query(Address).filter(
        Address.id == addressId,
        Address.user_id == current_user.id
    ).first()
    
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found"
        )
    
    db.delete(address)
    db.commit()
    
    return MessageResponse(message="Address deleted successfully")

@router.get("/payment-methods", response_model=List[PaymentMethodSchema])
async def get_payment_methods(current_user: User = Depends(get_current_active_user)):
    """Get user payment methods"""
    return [
        PaymentMethodSchema(
            id=str(pm.id),
            type=pm.type,
            last4=pm.last4,
            brand=pm.brand or "",
            expiryMonth=pm.expiry_month or 0,
            expiryYear=pm.expiry_year or 0,
            isDefault=pm.is_default,
            billingAddress=AddressSchema(
                id="",
                type="home",
                isDefault=False,
                firstName="",
                lastName="",
                addressLine1="",
                city="",
                state="",
                zipCode="",
                country=""
            )  # Simplified for now
        ) for pm in current_user.payment_methods
    ]

@router.delete("/payment-methods/{paymentMethodId}", response_model=MessageResponse)
async def delete_payment_method(
    paymentMethodId: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete payment method"""
    payment_method = db.query(PaymentMethod).filter(
        PaymentMethod.id == paymentMethodId,
        PaymentMethod.user_id == current_user.id
    ).first()
    
    if not payment_method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment method not found"
        )
    
    db.delete(payment_method)
    db.commit()
    
    return MessageResponse(message="Payment method deleted successfully")
