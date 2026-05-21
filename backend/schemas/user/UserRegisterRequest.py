from datetime import date

from pydantic import BaseModel, EmailStr


class UserRegisterRequest(BaseModel):
    login: str
    email: EmailStr
    password: str
    birthday: date
    