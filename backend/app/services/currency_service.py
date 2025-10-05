from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from app.core.config import settings


class CurrencyService:
    def __init__(self) -> None:
        self._country_cache: dict[str, tuple[datetime, dict[str, Any]]] = {}
        self._rates_cache: dict[str, tuple[datetime, dict[str, float]]] = {}

    async def get_country_currency(self, country_code: str) -> str:
        country_code = country_code.upper()
        cached = self._country_cache.get(country_code)
        if cached and cached[0] > datetime.now(timezone.utc):
            return cached[1]["currency"]

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.restcountries_url)
            response.raise_for_status()
            countries = response.json()

        for country in countries:
            if country_code == country.get("cca2"):
                currencies = country.get("currencies", {})
                if currencies:
                    currency_code = next(iter(currencies.keys()))
                    self._country_cache[country_code] = (
                        datetime.now(timezone.utc) + timedelta(minutes=settings.currency_cache_ttl_minutes),
                        {"currency": currency_code},
                    )
                    return currency_code

        raise ValueError(f"No currency found for country code {country_code}")

    async def convert_to_company_currency(self, amount: float, from_currency: str, to_currency: str) -> tuple[float, float]:
        if from_currency.upper() == to_currency.upper():
            return amount, 1.0

        rates = await self._get_rates_for_currency(from_currency)
        rate = rates.get(to_currency.upper())
        if rate is None:
            raise ValueError(f"Conversion rate from {from_currency} to {to_currency} not available")
        converted = amount * rate
        return converted, rate

    async def _get_rates_for_currency(self, base_currency: str) -> dict[str, float]:
        base_currency = base_currency.upper()
        cached = self._rates_cache.get(base_currency)
        if cached and cached[0] > datetime.now(timezone.utc):
            return cached[1]

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{settings.currency_api_base_url}/{base_currency}")
            response.raise_for_status()
            data = response.json()

        rates = data.get("rates") or {}
        self._rates_cache[base_currency] = (
            datetime.now(timezone.utc) + timedelta(minutes=settings.currency_cache_ttl_minutes),
            rates,
        )
        return rates


currency_service = CurrencyService()
