from __future__ import annotations

from datetime import datetime, date

from pydantic import BaseModel, Field

from app.schemas.common import ApprovalDecision, CurrencyCode, ExpenseStatus


class ExpenseLine(BaseModel):
    label: str
    amount: float


class ExpenseBase(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=500)
    category: str = Field(min_length=2, max_length=100)
    amount: float = Field(gt=0)
    currency_code: CurrencyCode
    expense_date: date
    receipt_url: str | None = None
    receipt_text: str | None = None
    lines: list[ExpenseLine] = Field(default_factory=list)


class ExpenseCreate(ExpenseBase):
    approval_rule_id: str | None = None


class ExpenseUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = Field(default=None, max_length=500)
    category: str | None = None
    amount: float | None = Field(default=None, gt=0)
    currency_code: CurrencyCode | None = None
    expense_date: date | None = None
    receipt_url: str | None = None
    receipt_text: str | None = None
    lines: list[ExpenseLine] | None = None


class ExpenseInDB(ExpenseBase):
    id: str
    company_id: str
    employee_id: str
    converted_amount: float
    conversion_rate: float
    company_currency: CurrencyCode
    status: ExpenseStatus
    current_step_index: int
    approver_sequence: list[str]
    approval_rule_id: str | None
    created_at: datetime
    updated_at: datetime


class ExpensePublic(ExpenseInDB):
    approval_history: list[dict]


class ExpenseListResponse(BaseModel):
    expenses: list[ExpensePublic]


class ApprovalAction(BaseModel):
    decision: ApprovalDecision
    comment: str | None = Field(default=None, max_length=500)
