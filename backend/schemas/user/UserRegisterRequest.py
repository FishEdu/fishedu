from datetime import date
import re

from pydantic import BaseModel, EmailStr, field_validator


class UserRegisterRequest(BaseModel):
    login: str
    email: EmailStr
    password: str
    birthday: date

    @field_validator("login")
    def validate_login(cls, v):
        if not v.strip():
            raise ValueError("Login can't be empty")
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 10:
            raise ValueError("Password must have at least 10 characters")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must have at least one big character")

        if not re.search(r"[0-9]", v):
            raise ValueError("Password must have at least one number")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must have at least one special character")

        return v
    