from sqlalchemy import Column, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from database import Base


class EducationMaterialTranslation(Base):
    __tablename__ = "education_material_translations"
    __table_args__ = (UniqueConstraint("material_id", "language", name="uq_education_material_translation"),)

    id = Column(Integer, primary_key=True)
    material_id = Column(Integer, ForeignKey("education_materials.id", ondelete="CASCADE"), nullable=False)
    language = Column(String(2), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text)

    material = relationship("EducationMaterial", back_populates="translations")
