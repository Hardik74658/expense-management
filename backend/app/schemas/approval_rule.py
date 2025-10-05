from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ApprovalRuleType


class ApprovalRuleBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    rule_type: ApprovalRuleType
    approver_ids: list[str] = Field(default_factory=list)
    percentage_threshold: int | None = Field(default=None, ge=1, le=100)
    specific_approver_id: str | None = None
    order: list[str] = Field(default_factory=list)
    is_active: bool = True


class ApprovalRuleCreate(ApprovalRuleBase):
    ...


class ApprovalRuleUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    rule_type: ApprovalRuleType | None = None
    approver_ids: list[str] | None = None
    percentage_threshold: int | None = Field(default=None, ge=1, le=100)
    specific_approver_id: str | None = None
    order: list[str] | None = None
    is_active: bool | None = None


class ApprovalRuleInDB(ApprovalRuleBase):
    id: str
    company_id: str
    created_at: datetime
    updated_at: datetime


class ApprovalRulePublic(ApprovalRuleBase):
    id: str
    created_at: datetime


class ApprovalRuleListResponse(BaseModel):
    rules: list[ApprovalRulePublic]
