from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import UserRole


class UserBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    role: UserRole
    manager_id: str | None = None
    is_manager_approver: bool = False


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    role: UserRole | None = None
    manager_id: str | None = None
    is_manager_approver: bool | None = None
    password: str | None = Field(default=None, min_length=8)


class UserInDB(UserBase):
    id: str
    company_id: str
    created_at: datetime
    updated_at: datetime


class UserPublic(UserBase):
    id: str
    created_at: datetime


class UserListResponse(BaseModel):
    users: list[UserPublic]
