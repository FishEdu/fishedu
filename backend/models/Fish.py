from sqlalchemy import Boolean, Column, Float, Integer, DateTime

from database import Base


class Fish(Base):
    __tablename__ = "fish"

    id = Column(Integer, primary_key=True)

    min_protection_length = Column(Float)
    max_protection_length = Column(Float)

    is_endangered = Column(Boolean)

    created_at = Column(DateTime)
    modified_at = Column(DateTime)