from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings


_client: AsyncIOMotorClient | None = None
_database: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global _client, _database
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongo_uri)
        _database = _client[settings.mongo_db_name]


async def close_mongo_connection() -> None:
    global _client, _database
    if _client:
        _client.close()
    _client = None
    _database = None


def get_database() -> AsyncIOMotorDatabase:
    if _database is None:
        raise RuntimeError("Mongo connection has not been initialised. Call connect_to_mongo first.")
    return _database


def get_collection(name: str) -> Any:
    db = get_database()
    return db[name]
