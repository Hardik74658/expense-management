from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.repositories.user_repository import UserRepository
from app.schemas.auth import AuthResponse, AuthUser, LoginRequest, SignupRequest, TokenResponse
from app.schemas.common import UserRole
from app.schemas.company import CompanyCreate
from app.services.company_service import company_service


class AuthService:
    def __init__(self) -> None:
        self.user_repo = UserRepository()

    async def signup(self, payload: SignupRequest) -> AuthResponse:
        existing = await self.user_repo.get_user_by_email(str(payload.email))
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        company = await company_service.create_company_with_currency(
            CompanyCreate(name=payload.company_name, country_code=payload.country_code)
        )
        if not company or "id" not in company:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create company")

        hashed_password = get_password_hash(payload.password)
        user_id = await self.user_repo.create_user(
            {
                "name": payload.name,
                "email": str(payload.email).lower(),
                "password_hash": hashed_password,
                "role": UserRole.admin.value,
                "company_id": company["id"],
                "is_active": True,
            }
        )

        await company_service.set_admin_user(company["id"], user_id)

        token = create_access_token(
            subject=user_id,
            additional_claims={"role": UserRole.admin.value, "company_id": company["id"]},
        )

        user = await self.user_repo.get_user_by_id(user_id)
        assert user is not None
        auth_user = AuthUser(
            id=user_id,
            name=user["name"],
            email=user["email"],
            role=UserRole.admin,
            company_id=company["id"],
            manager_id=user.get("manager_id"),
            created_at=user["created_at"],
        )
        return AuthResponse(token=TokenResponse(access_token=token), user=auth_user)

    async def login(self, payload: LoginRequest) -> AuthResponse:
        user = await self.user_repo.get_user_by_email(str(payload.email).lower())
        if not user or not verify_password(payload.password, user.get("password_hash", "")):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if not user.get("is_active", True):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

        token = create_access_token(
            subject=str(user["_id"]),
            additional_claims={"role": user["role"], "company_id": user["company_id"]},
        )

        auth_user = AuthUser(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            role=UserRole(user["role"]),
            company_id=user["company_id"],
            manager_id=user.get("manager_id"),
            created_at=user["created_at"],
        )
        return AuthResponse(token=TokenResponse(access_token=token), user=auth_user)


auth_service = AuthService()
