from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    project_name: str = "Expense Manager API"
    version: str = "0.1.0"

    mongo_uri: str = Field(default="mongodb://localhost:27017")
    mongo_db_name: str = Field(default="expense_manager")

    jwt_secret_key: str = Field(default="change-me")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60 * 24)

    cors_allow_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"])

    restcountries_url: str = Field(default="https://restcountries.com/v3.1/all?fields=name,currencies,cca2")
    currency_api_base_url: str = Field(default="https://api.exchangerate-api.com/v4/latest")
    currency_cache_ttl_minutes: int = Field(default=720)

    password_min_length: int = Field(default=8)

    class Config:
        env_file = ".env"
        case_sensitive = False

    @field_validator("cors_allow_origins", mode="before")
    @classmethod
    def split_cors(cls, value: str | List[str]) -> List[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
