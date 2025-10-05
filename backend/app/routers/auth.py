from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, summary="Create company and admin user")
async def signup(payload: SignupRequest) -> AuthResponse:
    return await auth_service.signup(payload)


@router.post("/login", response_model=AuthResponse, summary="Login and receive access token")
async def login(payload: LoginRequest) -> AuthResponse:
    return await auth_service.login(payload)


@router.get("/me", summary="Return current user")
async def get_profile(user = Depends(get_current_user)):
    return user
