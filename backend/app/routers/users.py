from fastapi import APIRouter, Depends, Path

from app.dependencies.auth import get_current_user, require_role
from app.schemas.common import UserRole
from app.schemas.user import UserCreate, UserListResponse, UserPublic, UserUpdate
from app.services.user_service import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=UserListResponse, summary="List company users")
async def list_users(current_user = Depends(require_role(UserRole.admin))):
    users = await user_service.list_users(current_user["company_id"])
    return {"users": users}


@router.post("", response_model=UserPublic, summary="Create a new user")
async def create_user(payload: UserCreate, current_user = Depends(require_role(UserRole.admin))):
    user = await user_service.create_user(current_user["company_id"], payload)
    return user


@router.patch("/{user_id}", response_model=UserPublic, summary="Update a user")
async def update_user(
    payload: UserUpdate,
    user_id: str = Path(..., description="User identifier"),
    current_user = Depends(require_role(UserRole.admin)),
):
    user = await user_service.update_user(current_user["company_id"], user_id, payload)
    return user


@router.delete("/{user_id}", status_code=204, summary="Delete a user")
async def delete_user(
    user_id: str = Path(..., description="User identifier"),
    current_user = Depends(require_role(UserRole.admin)),
):
    await user_service.delete_user(current_user["company_id"], user_id)
    return None
