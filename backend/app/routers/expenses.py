from fastapi import APIRouter, Depends, Path

from app.dependencies.auth import get_current_user, require_role
from app.schemas.common import ApprovalDecision, ExpenseStatus, UserRole
from app.schemas.expense import ApprovalAction, ExpenseCreate, ExpenseListResponse, ExpensePublic, ExpenseUpdate
from app.services.expense_service import expense_service

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("", response_model=ExpensePublic, summary="Submit an expense")
async def submit_expense(payload: ExpenseCreate, current_user = Depends(require_role(UserRole.employee))):
    expense = await expense_service.create_expense(current_user["company_id"], current_user["id"], payload)
    return expense


@router.get("/mine", response_model=ExpenseListResponse, summary="List my expenses")
async def list_my_expenses(current_user = Depends(require_role(UserRole.employee))):
    expenses = await expense_service.list_employee_expenses(current_user["company_id"], current_user["id"])
    return {"expenses": expenses}


@router.get("", response_model=ExpenseListResponse, summary="List company expenses")
async def list_company_expenses(current_user = Depends(require_role(UserRole.admin, UserRole.manager))):
    expenses = await expense_service.list_company_expenses(current_user["company_id"])
    return {"expenses": expenses}


@router.get("/pending", response_model=ExpenseListResponse, summary="Expenses awaiting my approval")
async def list_pending(current_user = Depends(require_role(UserRole.manager, UserRole.admin))):
    expenses = await expense_service.list_pending_for_approver(current_user["company_id"], current_user["id"])
    return {"expenses": expenses}


@router.patch("/{expense_id}", response_model=ExpensePublic, summary="Update pending expense")
async def update_expense(
    payload: ExpenseUpdate,
    expense_id: str = Path(..., description="Expense identifier"),
    current_user = Depends(require_role(UserRole.employee, UserRole.admin)),
):
    expense = await expense_service.update_expense(current_user["company_id"], expense_id, payload, current_user)
    return expense


@router.post("/{expense_id}/approval", response_model=ExpensePublic, summary="Approve or reject expense")
async def approve_expense(
    payload: ApprovalAction,
    expense_id: str = Path(..., description="Expense identifier"),
    current_user = Depends(require_role(UserRole.manager, UserRole.admin)),
):
    expense = await expense_service.record_approval(current_user["company_id"], expense_id, current_user["id"], payload)
    return expense
