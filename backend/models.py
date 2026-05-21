from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base
from datetime import datetime, timezone


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    login = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    birthday = Column(Date)

    role_id = Column(Integer, ForeignKey("roles.id"))

    role = relationship("Role")

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    modified_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )