from pydantic import BaseModel

class UserLoginRequest(BaseModel):
    login: str
    password: str
