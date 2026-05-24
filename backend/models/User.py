from sqlalchemy import Column, Date, String

from database import Base
from models.BaseModelMixin import BaseModelMixin

class User(Base, BaseModelMixin):
    __tablename__ = "users"

    login = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    birthday = Column(Date, nullable=False)
