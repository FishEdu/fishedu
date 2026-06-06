from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from database import Base


class FishPlTranslations(Base):
    __tablename__ = "fish_pl_translations"

    id = Column(Integer, primary_key=True)

    fish_id = Column(Integer, ForeignKey("fish.id"))
    habitat_id = Column(Integer, ForeignKey("fishing_areas.id"))

    name = Column(String)
    description = Column(Text)
    appearance = Column(Text)
    feeding_places = Column(Text)
    preferences = Column(Text)
    handling = Column(Text)

    created_at = Column(DateTime)
    modified_at = Column(DateTime)