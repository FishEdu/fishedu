from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timezone, timedelta

SECRET_KEY = "tajnyklucz"
ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password too long (bcrypt limit 72 bytes)")
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

def create_token(data: dict):
    payload = data.copy()

    payload["exp"] = datetime.now(timezone.utc) + timedelta(hours=2)

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )