from __future__ import annotations

from typing import Any

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field
from pydantic_core import core_schema


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: type[Any], _handler: core_schema.SchemaRef | None) -> core_schema.CoreSchema:  # type: ignore[override]
        return core_schema.no_info_after_validator_function(cls.validate, core_schema.union_schema([core_schema.str_schema(), core_schema.is_instance_schema(ObjectId)]))

    @classmethod
    def validate(cls, value: object) -> ObjectId:
        if isinstance(value, ObjectId):
            return value
        if isinstance(value, str) and ObjectId.is_valid(value):
            return ObjectId(value)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(cls, _schema: core_schema.CoreSchema, handler: core_schema.GetJsonSchemaHandler) -> dict[str, object]:  # type: ignore[override]
        json_schema = handler(core_schema.str_schema())
        json_schema.update(type="string")
        return json_schema


class MongoModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True, json_encoders={ObjectId: str})

    id: PyObjectId | None = Field(default=None, alias="_id")
