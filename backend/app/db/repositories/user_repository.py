from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId

from app.db.client import get_collection


class UserRepository:
    @property
    def collection(self):
        return get_collection("users")

    async def create_user(self, user_data: dict) -> str:
        now = datetime.now(timezone.utc)
        user_data.setdefault("created_at", now)
        user_data.setdefault("updated_at", now)
        result = await self.collection.insert_one(user_data)
        return str(result.inserted_id)

    async def get_user_by_email(self, email: str) -> dict | None:
        return await self.collection.find_one({"email": email})

    async def get_user_by_id(self, user_id: str) -> dict | None:
        if not ObjectId.is_valid(user_id):
            return None
        return await self.collection.find_one({"_id": ObjectId(user_id)})

    async def list_users_by_company(self, company_id: str) -> list[dict]:
        cursor = self.collection.find({"company_id": company_id})
        return [doc async for doc in cursor]

    async def get_users_by_ids(self, user_ids: list[str]) -> list[dict]:
        valid_ids = [ObjectId(user_id) for user_id in user_ids if ObjectId.is_valid(user_id)]
        if not valid_ids:
            return []
        cursor = self.collection.find({"_id": {"$in": valid_ids}})
        return [doc async for doc in cursor]

    async def update_user(self, user_id: str, update_data: dict) -> bool:
        if not ObjectId.is_valid(user_id):
            return False
        update_data["updated_at"] = datetime.now(timezone.utc)
        result = await self.collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        return result.modified_count > 0

    async def delete_user(self, user_id: str) -> bool:
        if not ObjectId.is_valid(user_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0
