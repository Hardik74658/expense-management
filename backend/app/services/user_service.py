from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status

from app.core.security import get_password_hash
from app.db.repositories.user_repository import UserRepository
from app.schemas.common import UserRole
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self) -> None:
        self.user_repo = UserRepository()

    async def create_user(self, company_id: str, payload: UserCreate) -> dict[str, Any]:
        existing = await self.user_repo.get_user_by_email(str(payload.email).lower())
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user_data = payload.model_dump()
        password = user_data.pop("password")
        user_data.update(
            {
                "company_id": company_id,
                "password_hash": get_password_hash(password),
                "email": str(payload.email).lower(),
            }
        )
        user_id = await self.user_repo.create_user(user_data)
        user = await self.user_repo.get_user_by_id(user_id)
        assert user is not None
        return self._to_public(user)

    async def list_users(self, company_id: str) -> list[dict[str, Any]]:
        users = await self.user_repo.list_users_by_company(company_id)
        return [self._to_public(user) for user in users]

    async def update_user(self, company_id: str, user_id: str, payload: UserUpdate) -> dict[str, Any]:
        user = await self.user_repo.get_user_by_id(user_id)
        if not user or user.get("company_id") != company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        update_data = payload.model_dump(exclude_unset=True)
        if "password" in update_data:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))

        if not update_data:
            return self._to_public(user)

        success = await self.user_repo.update_user(user_id, update_data)
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update user")

        updated = await self.user_repo.get_user_by_id(user_id)
        assert updated is not None
        return self._to_public(updated)

    async def delete_user(self, company_id: str, user_id: str) -> None:
        user = await self.user_repo.get_user_by_id(user_id)
        if not user or user.get("company_id") != company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        success = await self.user_repo.delete_user(user_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete user")

    def _to_public(self, user: dict[str, Any]) -> dict[str, Any]:
        data = {
            "id": str(user.get("_id")),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "manager_id": user.get("manager_id"),
            "is_manager_approver": user.get("is_manager_approver", False),
            "created_at": user.get("created_at"),
        }
        return data


user_service = UserService()
