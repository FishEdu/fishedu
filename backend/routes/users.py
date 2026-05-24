from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models.Role import Role
from models.User import User
from models.UserRole import UserRole
from schemas.User import UserRegisterRequest, UserLoginRequest
from auth import (
    hash_password,
    verify_password,
    create_token
)

from utils import utils as u

router = APIRouter()

@router.post("/api/v1/register")
def register(user: UserRegisterRequest):
    db = SessionLocal()

    try:
        email_exists = (
            db.query(User)
            .filter(User.email == user.email)
            .first()
        )

        if email_exists:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
        )

        default_role = (
            db.query(Role)
            .filter(Role.name == "user")
            .first()
        )

        if not default_role:
            raise HTTPException(
                status_code=500,
                detail="Default role not found in database"
            )

        now = u.get_utc_date()
        new_user = User(
            login=user.login,
            email=user.email,
            password=hash_password(user.password),
            birthday=user.birthday,
            created_at=now,
            modified_at=now
        )


        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        new_user = (
            db
            .query(User)
            .filter(User.email == new_user.email)
            .first()
        )

        now = u.get_utc_date()
        users_roles_entry = UserRole(
            role_id = default_role.id,
            user_id = new_user.id,
            created_at = now,
            modified_at = now
        )

        db.add(users_roles_entry)
        db.commit()
        db.refresh(users_roles_entry)

        return {"message": "User created"}

    finally:
        db.close()


@router.post("/api/v1/login")
def login(user: UserLoginRequest):

    db = SessionLocal()

    try:
        existing = (
            db.query(User)
            .filter(User.login == user.login)
            .first()
        )

        if not existing:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        if not verify_password(
            user.password,
            existing.password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        token = create_token({
            "user_id": existing.id,
            "role": existing.role.name
        })

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    finally:
        db.close()