from sqlalchemy import Column, ForeignKey, Integer, String, Text, DateTime

from database import Base


class RecipePlTranslations(Base):
    __tablename__ = "recipes_pl_translations"

    id = Column(Integer, primary_key=True)

    recipe_id = Column(Integer, ForeignKey("recipes.id"))

    name = Column(String)
    content = Column(Text)

    created_at = Column(DateTime)
    modified_at = Column(DateTime)