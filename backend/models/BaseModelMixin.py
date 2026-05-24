from sqlalchemy import Column, Integer, DateTime, func

class BaseModelMixin:
  id = Column(Integer, primary_key=True, index=True)
  created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
  modified_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=False)
