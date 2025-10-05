from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class CompanyBase(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    country_code: str = Field(min_length=2, max_length=2)
    currency_code: str = Field(min_length=1, max_length=3)


class CompanyCreate(BaseModel):
    name: str
    country_code: str


class CompanyUpdate(BaseModel):
    name: str | None = None
    country_code: str | None = None
    currency_code: str | None = None


class CompanyInDB(CompanyBase):
    id: str
    created_at: datetime
    updated_at: datetime


class CompanyPublic(CompanyBase):
    id: str
    created_at: datetime


class CompanyWithAdmin(CompanyPublic):
    admin_user_id: str
