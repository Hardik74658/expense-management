from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import UserRole


class TokenPayload(BaseModel):
    sub: str
    exp: int
    role: UserRole
    company_id: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)
    company_name: str = Field(min_length=2, max_length=200)
    country_code: str = Field(min_length=2, max_length=2)


class AuthUser(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    company_id: str
    manager_id: str | None = None
    is_active: bool = True
    created_at: datetime


class AuthResponse(BaseModel):
    token: TokenResponse
    user: AuthUser
