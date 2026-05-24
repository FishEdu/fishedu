from sqlalchemy import Column, String

from database import Base
from models.BaseModelMixin import BaseModelMixin


class Role(Base, BaseModelMixin):
    __tablename__ = "roles"

    name = Column(String, unique=True)
