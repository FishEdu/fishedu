from sqlalchemy import Column, DateTime, Integer
from database import Base

class UserRole(Base):
    __tablename__ = "users_roles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    role_id = Column(Integer)
    created_at = Column(DateTime)
    modified_at = Column(DateTime)
