from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException, status

from app.db.repositories.approval_rule_repository import ApprovalRuleRepository
from app.db.repositories.company_repository import CompanyRepository
from app.db.repositories.expense_repository import ExpenseRepository
from app.db.repositories.user_repository import UserRepository
from app.schemas.common import ApprovalDecision, ExpenseStatus, UserRole
from app.schemas.expense import ApprovalAction, ExpenseCreate, ExpenseUpdate
from app.services.currency_service import currency_service


class ExpenseService:
    def __init__(self) -> None:
        self.expense_repo = ExpenseRepository()
        self.user_repo = UserRepository()
        self.company_repo = CompanyRepository()
        self.rule_repo = ApprovalRuleRepository()

    async def create_expense(self, company_id: str, employee_id: str, payload: ExpenseCreate) -> dict[str, Any]:
        employee = await self.user_repo.get_user_by_id(employee_id)
        if not employee or employee.get("company_id") != company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
        if employee.get("role") != UserRole.employee.value:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only employees can submit expenses")

        company = await self.company_repo.get_company_by_id(company_id)
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

        rule = await self._resolve_rule(company_id, payload.approval_rule_id)
        approver_sequence = await self._build_approver_sequence(employee, rule)
        if not approver_sequence:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No approvers configured")

        converted_amount, rate = await currency_service.convert_to_company_currency(
            payload.amount, payload.currency_code, company["currency_code"]
        )

        expense_data = payload.model_dump()
        expense_data.update(
            {
                "company_id": company_id,
                "employee_id": employee_id,
                "status": ExpenseStatus.pending.value,
                "approver_sequence": approver_sequence,
                "current_step_index": 0,
                "approval_rule_id": rule["id"] if rule else None,
                "approval_history": [],
                "company_currency": company["currency_code"],
                "converted_amount": converted_amount,
                "conversion_rate": rate,
            }
        )
        expense_id = await self.expense_repo.create_expense(expense_data)
        expense = await self.expense_repo.get_expense_by_id(expense_id)
        return self._serialize_expense(expense)

    async def list_employee_expenses(self, company_id: str, employee_id: str) -> list[dict[str, Any]]:
        expenses = await self.expense_repo.list_expenses_for_employee(company_id, employee_id)
        return [self._serialize_expense(expense) for expense in expenses]

    async def list_company_expenses(self, company_id: str) -> list[dict[str, Any]]:
        expenses = await self.expense_repo.list_expenses_for_company(company_id)
        return [self._serialize_expense(expense) for expense in expenses]

    async def list_pending_for_approver(self, company_id: str, approver_id: str) -> list[dict[str, Any]]:
        expenses = await self.expense_repo.list_pending_for_approver(company_id)
        pending: list[dict[str, Any]] = []
        for expense in expenses:
            approver_sequence: list[str] = expense.get("approver_sequence", [])
            current_index: int = expense.get("current_step_index", 0)
            if expense.get("status") != ExpenseStatus.pending.value:
                continue
            if current_index < len(approver_sequence) and approver_sequence[current_index] == approver_id:
                pending.append(self._serialize_expense(expense))
        return pending

    async def update_expense(self, company_id: str, expense_id: str, payload: ExpenseUpdate, requester: dict[str, Any]) -> dict[str, Any]:
        expense = await self.expense_repo.get_expense_by_id(expense_id)
        if not expense or expense.get("company_id") != company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        if expense.get("status") != ExpenseStatus.pending.value:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only pending expenses can be updated")
        if requester.get("role") == UserRole.employee.value and expense.get("employee_id") != requester.get("id"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised to update this expense")

        update_data = payload.model_dump(exclude_unset=True)
        if update_data:
            if "amount" in update_data or "currency_code" in update_data:
                company = await self.company_repo.get_company_by_id(company_id)
                if company:
                    amount = update_data.get("amount", expense.get("amount"))
                    currency = update_data.get("currency_code", expense.get("currency_code"))
                    converted_amount, rate = await currency_service.convert_to_company_currency(
                        amount,
                        currency,
                        company["currency_code"],
                    )
                    update_data["converted_amount"] = converted_amount
                    update_data["conversion_rate"] = rate
        success = await self.expense_repo.update_expense(expense_id, update_data)
        if not success:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update expense")

        updated = await self.expense_repo.get_expense_by_id(expense_id)
        return self._serialize_expense(updated)

    async def record_approval(self, company_id: str, expense_id: str, approver_id: str, payload: ApprovalAction) -> dict[str, Any]:
        expense = await self.expense_repo.get_expense_by_id(expense_id)
        if not expense or expense.get("company_id") != company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        if expense.get("status") != ExpenseStatus.pending.value:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Expense already resolved")

        approver_sequence: list[str] = expense.get("approver_sequence", [])
        current_index: int = expense.get("current_step_index", 0)
        if current_index >= len(approver_sequence) or approver_sequence[current_index] != approver_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised to approve this expense")

        approval_entry = {
            "approver_id": approver_id,
            "decision": payload.decision.value,
            "comment": payload.comment,
            "timestamp": datetime.now(timezone.utc),
        }
        await self.expense_repo.add_approval_entry(expense_id, approval_entry)

        expense = await self.expense_repo.get_expense_by_id(expense_id)
        rule = None
        if expense.get("approval_rule_id"):
            rule = await self.rule_repo.get_rule_by_id(expense["approval_rule_id"])
            if rule:
                rule["id"] = str(rule.pop("_id"))

        status_update = await self._evaluate_approval(expense, rule, payload.decision == ApprovalDecision.approved)
        await self.expense_repo.update_expense(expense_id, status_update)

        updated = await self.expense_repo.get_expense_by_id(expense_id)
        return self._serialize_expense(updated)

    async def _resolve_rule(self, company_id: str, rule_id: str | None) -> dict[str, Any] | None:
        rule = None
        if rule_id:
            rule = await self.rule_repo.get_rule_by_id(rule_id)
            if rule and rule.get("company_id") == company_id:
                rule["id"] = str(rule.pop("_id"))
            else:
                rule = None
        if rule is None:
            rules = await self.rule_repo.list_active_rules_for_company(company_id)
            if rules:
                rule = rules[0]
                rule["id"] = str(rule.pop("_id"))
        return rule

    async def _build_approver_sequence(self, employee: dict[str, Any], rule: dict[str, Any] | None) -> list[str]:
        sequence: list[str] = []
        if employee.get("manager_id") and employee.get("is_manager_approver"):
            sequence.append(employee["manager_id"])
        if rule:
            order = rule.get("order") or []
            for approver_id in order:
                if approver_id not in sequence:
                    sequence.append(approver_id)
            for approver_id in rule.get("approver_ids", []):
                if approver_id not in sequence:
                    sequence.append(approver_id)
            specific = rule.get("specific_approver_id")
            if specific and specific not in sequence:
                sequence.append(specific)
        return sequence

    async def _evaluate_approval(self, expense: dict[str, Any], rule: dict[str, Any] | None, approved: bool) -> dict[str, Any]:
        approver_sequence: list[str] = expense.get("approver_sequence", [])
        current_index: int = expense.get("current_step_index", 0)
        approval_history: list[dict[str, Any]] = expense.get("approval_history", [])

        if not approved:
            return {
                "status": ExpenseStatus.rejected.value,
                "current_step_index": len(approver_sequence),
            }

        if rule and rule.get("rule_type") in {"percentage", "hybrid"} and rule.get("percentage_threshold"):
            approvals = len({entry["approver_id"] for entry in approval_history if entry["decision"] == ApprovalDecision.approved.value})
            required = max(1, round(len(approver_sequence) * (rule["percentage_threshold"] / 100)))
            if approvals >= required:
                return {
                    "status": ExpenseStatus.approved.value,
                    "current_step_index": len(approver_sequence),
                }

        if rule and rule.get("rule_type") in {"specific", "hybrid"} and rule.get("specific_approver_id"):
            specific = rule["specific_approver_id"]
            specific_approved = any(
                entry["approver_id"] == specific and entry["decision"] == ApprovalDecision.approved.value
                for entry in approval_history
            )
            if specific_approved:
                return {
                    "status": ExpenseStatus.approved.value,
                    "current_step_index": len(approver_sequence),
                }

        next_index = current_index + 1
        if next_index >= len(approver_sequence):
            return {
                "status": ExpenseStatus.approved.value,
                "current_step_index": next_index,
            }

        return {
            "current_step_index": next_index,
        }

    def _serialize_expense(self, expense: dict[str, Any] | None) -> dict[str, Any]:
        if not expense:
            return {}
        expense = dict(expense)
        expense["id"] = str(expense.pop("_id"))
        expense.setdefault("approval_history", [])
        return expense


expense_service = ExpenseService()
