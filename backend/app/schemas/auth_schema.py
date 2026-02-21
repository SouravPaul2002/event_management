from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class SignupSchema(BaseModel):
    name: str
    email: EmailStr
    passwords: str
    role: str
    category: Optional[str] = None
    image_url: Optional[str] = None
    @field_validator("category")
    def validate_category(cls, value, info):
        role = info.data.get("role")

        if role == "vendor":
            if not value:
                raise ValueError("Category is required for vendor")

            allowed_categories = [
                "catering",
                "florist",
                "decoration",
                "lighting"
            ]

            if value not in allowed_categories:
                raise ValueError("Invalid category")

        return value


class LoginSchema(BaseModel):
    email: EmailStr
    passwords: str

