from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from database import Base
from sqlalchemy.orm import relationship


class CatchRecord(Base):
    __tablename__ = "catch_records"

    id = Column(Integer, primary_key=True)


    fish_id = Column(Integer, ForeignKey("fish.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False,)

    fish_name = Column(String, nullable=True)
    fishing_spot = Column(String, nullable=False)
    total_length = Column(Float, nullable=True)
    fork_length = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    modified_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship(
    "User",
    back_populates="records",
    )

    fish = relationship(
        "Fish",
    )
