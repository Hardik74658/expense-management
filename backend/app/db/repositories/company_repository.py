from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId

from app.db.client import get_collection


class CompanyRepository:
    @property
    def collection(self):
        return get_collection("companies")

    async def create_company(self, company_data: dict) -> str:
        now = datetime.now(timezone.utc)
        company_data.setdefault("created_at", now)
        company_data.setdefault("updated_at", now)
        result = await self.collection.insert_one(company_data)
        return str(result.inserted_id)

    async def get_company_by_id(self, company_id: str) -> dict | None:
        if not ObjectId.is_valid(company_id):
            return None
        return await self.collection.find_one({"_id": ObjectId(company_id)})

    async def update_company(self, company_id: str, update_data: dict) -> bool:
        if not ObjectId.is_valid(company_id):
            return False
        update_data["updated_at"] = datetime.now(timezone.utc)
        result = await self.collection.update_one({"_id": ObjectId(company_id)}, {"$set": update_data})
        return result.modified_count > 0

    async def list_companies(self) -> list[dict]:
        cursor = self.collection.find()
        return [doc async for doc in cursor]
