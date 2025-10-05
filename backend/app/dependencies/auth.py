from __future__ import annotations

from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.db.repositories.user_repository import UserRepository
from app.schemas.auth import TokenPayload
from app.schemas.common import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        token_data = TokenPayload(**payload)
        if datetime.fromtimestamp(token_data.exp, tz=timezone.utc) < datetime.now(tz=timezone.utc):
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception

    user_repo = UserRepository()
    user = await user_repo.get_user_by_id(token_data.sub)
    if not user or user.get("company_id") != token_data.company_id:
        raise credentials_exception
    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    user["id"] = str(user.pop("_id"))
    user.pop("password_hash", None)
    return user


def require_role(*roles: UserRole):
    async def role_checker(user = Depends(get_current_user)):
        if roles and user.get("role") not in [role.value for role in roles]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return user

    return role_checker
