from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId

from app.db.client import get_collection


class ExpenseRepository:
    @property
    def collection(self):
        return get_collection("expenses")

    async def create_expense(self, expense_data: dict) -> str:
        now = datetime.now(timezone.utc)
        expense_data.setdefault("created_at", now)
        expense_data.setdefault("updated_at", now)
        result = await self.collection.insert_one(expense_data)
        return str(result.inserted_id)

    async def get_expense_by_id(self, expense_id: str) -> dict | None:
        if not ObjectId.is_valid(expense_id):
            return None
        return await self.collection.find_one({"_id": ObjectId(expense_id)})

    async def list_expenses_for_company(self, company_id: str) -> list[dict]:
        cursor = self.collection.find({"company_id": company_id})
        return [doc async for doc in cursor]

    async def list_expenses_for_employee(self, company_id: str, employee_id: str) -> list[dict]:
        cursor = self.collection.find({"company_id": company_id, "employee_id": employee_id})
        return [doc async for doc in cursor]

    async def list_pending_for_approver(self, company_id: str) -> list[dict]:
        cursor = self.collection.find({
            "company_id": company_id,
            "status": "pending",
        })
        return [doc async for doc in cursor]

    async def update_expense(self, expense_id: str, update_data: dict) -> bool:
        if not ObjectId.is_valid(expense_id):
            return False
        update_data["updated_at"] = datetime.now(timezone.utc)
        result = await self.collection.update_one({"_id": ObjectId(expense_id)}, {"$set": update_data})
        return result.modified_count > 0

    async def add_approval_entry(self, expense_id: str, approval_entry: dict) -> bool:
        if not ObjectId.is_valid(expense_id):
            return False
        result = await self.collection.update_one(
            {"_id": ObjectId(expense_id)},
            {
                "$push": {"approval_history": approval_entry},
                "$set": {"updated_at": datetime.now(timezone.utc)},
            },
        )
        return result.modified_count > 0
