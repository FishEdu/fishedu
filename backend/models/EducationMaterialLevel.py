from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class EducationMaterialLevel(Base):
    __tablename__ = "education_material_levels"

    material_id = Column(Integer, ForeignKey("education_materials.id", ondelete="CASCADE"), primary_key=True)
    level = Column(String(20), primary_key=True)

    material = relationship("EducationMaterial", back_populates="levels")
