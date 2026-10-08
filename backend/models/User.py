from datetime import datetime, timezone

from sqlalchemy import Column, Date, DateTime, Integer, String

from database import Base

from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    login = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    birthday = Column(Date)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    modified_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    records = relationship(
        "CatchRecord",
        back_populates="user",
    )