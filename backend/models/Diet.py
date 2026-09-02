from sqlalchemy import Column, Integer, DateTime

from database import Base


class Diet(Base):
    __tablename__ = "diets"

    id = Column(Integer, primary_key=True)

    created_at = Column(DateTime)
    modified_at = Column(DateTime)