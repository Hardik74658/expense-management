from __future__ import annotations

from typing import Any

from bson import ObjectId


def serialize_document(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if document is None:
        return None
    serialized: dict[str, Any] = {}
    for key, value in document.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, list):
            serialized[key] = [serialize_document(item) if isinstance(item, dict) else str(item) if isinstance(item, ObjectId) else item for item in value]
        elif isinstance(value, dict):
            serialized[key] = serialize_document(value)  # type: ignore[arg-type]
        else:
            serialized[key] = value
    if "_id" in serialized:
        serialized["id"] = serialized.pop("_id")
    return serialized


def serialize_documents(documents: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [serialize_document(document) or {} for document in documents]
