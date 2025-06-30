from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from .user import UserProfile

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    firstName: str
    lastName: str
    phone: Optional[str] = None
    dateOfBirth: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    token: str
    refreshToken: Optional[str] = None
    user: UserProfile
    expiresAt: datetime

class RefreshTokenRequest(BaseModel):
    refreshToken: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    newPassword: str = Field(..., min_length=8)

class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str = Field(..., min_length=8)
