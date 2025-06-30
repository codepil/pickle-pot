from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from core.database import get_db
from core.auth import (
    authenticate_user, create_access_token, create_refresh_token,
    get_password_hash, verify_token, get_current_user
)
from models.user import User
from schemas.auth import (
    RegisterRequest, LoginRequest, AuthResponse, RefreshTokenRequest,
    ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
)
from schemas.common import MessageResponse, ErrorResponse
from schemas.user import UserProfile

router = APIRouter()

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(request.password)
    user = User(
        email=request.email,
        hashed_password=hashed_password,
        first_name=request.firstName,
        last_name=request.lastName,
        phone=request.phone,
        date_of_birth=request.dateOfBirth
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    
    # Convert user to UserProfile
    user_profile = UserProfile(
        id=str(user.id),
        email=user.email,
        firstName=user.first_name,
        lastName=user.last_name,
        phone=user.phone,
        dateOfBirth=user.date_of_birth,
        preferredContactMethod=user.preferred_contact_method,
        preferredContactTime=user.preferred_contact_time,
        addresses=[],
        paymentMethods=[],
        createdAt=user.created_at
    )
    
    return AuthResponse(
        token=access_token,
        refreshToken=refresh_token,
        user=user_profile,
        expiresAt=expires_at
    )

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password"""
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    
    # Convert user to UserProfile
    user_profile = UserProfile(
        id=str(user.id),
        email=user.email,
        firstName=user.first_name,
        lastName=user.last_name,
        phone=user.phone,
        dateOfBirth=user.date_of_birth,
        preferredContactMethod=user.preferred_contact_method,
        preferredContactTime=user.preferred_contact_time,
        addresses=[],
        paymentMethods=[],
        createdAt=user.created_at
    )
    
    return AuthResponse(
        token=access_token,
        refreshToken=refresh_token,
        user=user_profile,
        expiresAt=expires_at
    )

@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: User = Depends(get_current_user)):
    """Logout current user"""
    # In a real implementation, you would invalidate the token
    # For now, we'll just return a success message
    return MessageResponse(message="Logged out successfully")

@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    try:
        payload = verify_token(request.refreshToken)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})
        expires_at = datetime.utcnow() + timedelta(minutes=30)
        
        # Convert user to UserProfile
        user_profile = UserProfile(
            id=str(user.id),
            email=user.email,
            firstName=user.first_name,
            lastName=user.last_name,
            phone=user.phone,
            dateOfBirth=user.date_of_birth,
            preferredContactMethod=user.preferred_contact_method,
            preferredContactTime=user.preferred_contact_time,
            addresses=[],
            paymentMethods=[],
            createdAt=user.created_at
        )
        
        return AuthResponse(
            token=access_token,
            refreshToken=new_refresh_token,
            user=user_profile,
            expiresAt=expires_at
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Send password reset email"""
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        # Don't reveal if email exists
        return MessageResponse(message="If the email exists, a reset link has been sent")
    
    # In a real implementation, generate reset token and send email
    # For now, just return success message
    return MessageResponse(message="Password reset email sent")

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password with token"""
    # In a real implementation, verify the reset token
    # For now, just return success message
    return MessageResponse(message="Password reset successfully")

@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    from core.auth import verify_password
    
    # Verify current password
    if not verify_password(request.currentPassword, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    # Update password
    current_user.hashed_password = get_password_hash(request.newPassword)
    db.commit()
    
    return MessageResponse(message="Password changed successfully")
