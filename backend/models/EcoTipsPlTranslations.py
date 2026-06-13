from sqlalchemy import Column, Integer, String, Text
from database import Base

class EcoTipsPlTranslations(Base):
  __tablename__ = "eco_tips_pl_translations"

  id = Column(Integer, primary_key=True)
  title = Column(String)
  description = Column(Text)
