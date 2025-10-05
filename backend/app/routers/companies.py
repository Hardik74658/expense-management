from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user, require_role
from app.schemas.common import UserRole
from app.schemas.company import CompanyPublic, CompanyUpdate
from app.services.company_service import company_service

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/me", response_model=CompanyPublic, summary="Get current company")
async def get_company(current_user = Depends(get_current_user)):
    company = await company_service.get_company(current_user["company_id"])
    return company


@router.patch("/me", response_model=CompanyPublic, summary="Update current company")
async def update_company(payload: CompanyUpdate, current_user = Depends(require_role(UserRole.admin))):
    company = await company_service.update_company(current_user["company_id"], payload)
    return company
