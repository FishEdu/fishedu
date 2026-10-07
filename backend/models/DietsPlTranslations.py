from sqlalchemy import Column, ForeignKey, Integer, String, DateTime

from database import Base


class DietPlTranslations(Base):
    __tablename__ = "diets_pl_translations"

    id = Column(Integer, primary_key=True)

    diet_id = Column(Integer, ForeignKey("diets.id"))

    name = Column(String)

    created_at = Column(DateTime)
    modified_at = Column(DateTime)