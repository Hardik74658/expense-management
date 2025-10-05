from __future__ import annotations

from enum import Enum
from typing import Literal


class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    employee = "employee"


class ExpenseStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class ApprovalDecision(str, Enum):
    approved = "approved"
    rejected = "rejected"


CurrencyCode = str
CountryCode = str
ApprovalRuleType = Literal["sequential", "percentage", "specific", "hybrid"]
