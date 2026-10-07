from sqlalchemy import Column, Integer, DateTime

from database import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)

    created_at = Column(DateTime)
    modified_at = Column(DateTime)