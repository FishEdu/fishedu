from pydantic import BaseModel, EmailStr
from datetime import date

class UserRegister(BaseModel):
    login: str
    email: EmailStr
    password: str
    birthday: date

class UserLogin(BaseModel):
    login: str
    password: str