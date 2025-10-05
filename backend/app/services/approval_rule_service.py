from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status

from app.db.repositories.approval_rule_repository import ApprovalRuleRepository
from app.schemas.approval_rule import ApprovalRuleCreate, ApprovalRuleUpdate


class ApprovalRuleService:
    def __init__(self) -> None:
        self.repo = ApprovalRuleRepository()

    async def create_rule(self, company_id: str, payload: ApprovalRuleCreate) -> dict[str, Any]:
        rule_data = payload.model_dump()
        rule_data.update({"company_id": company_id})
        rule_id = await self.repo.create_rule(rule_data)
        rule = await self.repo.get_rule_by_id(rule_id)
        assert rule is not None
        rule["id"] = str(rule.pop("_id"))
        return rule

    async def list_rules(self, company_id: str) -> list[dict[str, Any]]:
        rules = await self.repo.list_rules_for_company(company_id)
        for rule in rules:
            rule["id"] = str(rule.pop("_id"))
        return rules

    async def update_rule(self, company_id: str, rule_id: str, payload: ApprovalRuleUpdate) -> dict[str, Any]:
        rule = await self.repo.get_rule_by_id(rule_id)
        if not rule or rule.get("company_id") != company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")

        success = await self.repo.update_rule(rule_id, payload.model_dump(exclude_unset=True))
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update rule")

        updated = await self.repo.get_rule_by_id(rule_id)
        assert updated is not None
        updated["id"] = str(updated.pop("_id"))
        return updated

    async def delete_rule(self, company_id: str, rule_id: str) -> None:
        rule = await self.repo.get_rule_by_id(rule_id)
        if not rule or rule.get("company_id") != company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")

        success = await self.repo.delete_rule(rule_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete rule")


approval_rule_service = ApprovalRuleService()
