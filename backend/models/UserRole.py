from sqlalchemy import Column, DateTime, ForeignKey, Integer, func
from models.BaseModelMixin import BaseModelMixin
from database import Base


class UserRole(Base, BaseModelMixin):
    __tablename__ = "users_roles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role_id = Column(Integer, ForeignKey("roles.id"))
