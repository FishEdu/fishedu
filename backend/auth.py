from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta

SECRET_KEY = "tajnyklucz"
ALGORITHM = "HS256"
security = HTTPBearer(auto_error=False)

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


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(security)
):
    if not credentials:
        return None

    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except JWTError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token"
        ) from error

    if not isinstance(user_id, int):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token"
        )

    from database import SessionLocal
    from models import User

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return user
    finally:
        db.close()


def get_current_user(
    current_user=Depends(get_current_user_optional)
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return current_user
