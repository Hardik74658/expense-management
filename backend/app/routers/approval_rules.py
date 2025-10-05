from fastapi import APIRouter, Depends, Path

from app.dependencies.auth import require_role
from app.schemas.approval_rule import ApprovalRuleCreate, ApprovalRuleListResponse, ApprovalRulePublic, ApprovalRuleUpdate
from app.schemas.common import UserRole
from app.services.approval_rule_service import approval_rule_service

router = APIRouter(prefix="/approval-rules", tags=["approval_rules"])


@router.get("", response_model=ApprovalRuleListResponse, summary="List approval rules")
async def list_rules(current_user = Depends(require_role(UserRole.admin))):
    rules = await approval_rule_service.list_rules(current_user["company_id"])
    return {"rules": rules}


@router.post("", response_model=ApprovalRulePublic, summary="Create approval rule")
async def create_rule(payload: ApprovalRuleCreate, current_user = Depends(require_role(UserRole.admin))):
    rule = await approval_rule_service.create_rule(current_user["company_id"], payload)
    return rule


@router.patch("/{rule_id}", response_model=ApprovalRulePublic, summary="Update approval rule")
async def update_rule(
    payload: ApprovalRuleUpdate,
    rule_id: str = Path(..., description="Rule identifier"),
    current_user = Depends(require_role(UserRole.admin)),
):
    rule = await approval_rule_service.update_rule(current_user["company_id"], rule_id, payload)
    return rule


@router.delete("/{rule_id}", status_code=204, summary="Delete approval rule")
async def delete_rule(
    rule_id: str = Path(..., description="Rule identifier"),
    current_user = Depends(require_role(UserRole.admin)),
):
    await approval_rule_service.delete_rule(current_user["company_id"], rule_id)
    return None
