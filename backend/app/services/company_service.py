from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status

from app.db.repositories.company_repository import CompanyRepository
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.services.currency_service import currency_service


class CompanyService:
    def __init__(self) -> None:
        self.company_repo = CompanyRepository()

    async def create_company_with_currency(self, payload: CompanyCreate) -> dict[str, Any]:
        currency_code = await currency_service.get_country_currency(payload.country_code)
        company_data = {
            "name": payload.name,
            "country_code": payload.country_code.upper(),
            "currency_code": currency_code,
        }
        company_id = await self.company_repo.create_company(company_data)
        company = await self.company_repo.get_company_by_id(company_id)
        if company:
            company["id"] = str(company.pop("_id"))
        return company or {}

    async def get_company(self, company_id: str) -> dict[str, Any] | None:
        company = await self.company_repo.get_company_by_id(company_id)
        if company:
            company["id"] = str(company.pop("_id"))
        return company

    async def update_company(self, company_id: str, payload: CompanyUpdate) -> dict[str, Any]:
        update_data = payload.model_dump(exclude_unset=True)
        if "country_code" in update_data and "currency_code" not in update_data:
            update_data["currency_code"] = await currency_service.get_country_currency(update_data["country_code"])
        if update_data:
            success = await self.company_repo.update_company(company_id, update_data)
            if not success:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update company")
        company = await self.company_repo.get_company_by_id(company_id)
        if company:
            company["id"] = str(company.pop("_id"))
        return company or {}

    async def set_admin_user(self, company_id: str, admin_user_id: str) -> None:
        await self.company_repo.update_company(company_id, {"admin_user_id": admin_user_id})


company_service = CompanyService()
