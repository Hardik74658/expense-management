from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId

from app.db.client import get_collection


class ApprovalRuleRepository:
    @property
    def collection(self):
        return get_collection("approval_rules")

    async def create_rule(self, rule_data: dict) -> str:
        now = datetime.now(timezone.utc)
        rule_data.setdefault("created_at", now)
        rule_data.setdefault("updated_at", now)
        result = await self.collection.insert_one(rule_data)
        return str(result.inserted_id)

    async def get_rule_by_id(self, rule_id: str) -> dict | None:
        if not ObjectId.is_valid(rule_id):
            return None
        return await self.collection.find_one({"_id": ObjectId(rule_id)})

    async def list_rules_for_company(self, company_id: str) -> list[dict]:
        cursor = self.collection.find({"company_id": company_id})
        return [doc async for doc in cursor]

    async def list_active_rules_for_company(self, company_id: str) -> list[dict]:
        cursor = self.collection.find({"company_id": company_id, "is_active": True})
        return [doc async for doc in cursor]

    async def update_rule(self, rule_id: str, update_data: dict) -> bool:
        if not ObjectId.is_valid(rule_id):
            return False
        update_data["updated_at"] = datetime.now(timezone.utc)
        result = await self.collection.update_one({"_id": ObjectId(rule_id)}, {"$set": update_data})
        return result.modified_count > 0

    async def delete_rule(self, rule_id: str) -> bool:
        if not ObjectId.is_valid(rule_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(rule_id)})
        return result.deleted_count > 0
