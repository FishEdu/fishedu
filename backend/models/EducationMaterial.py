from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class EducationMaterial(Base):
    __tablename__ = "education_materials"

    id = Column(Integer, primary_key=True)
    material_type = Column(String(20), nullable=False)
    image_url = Column(String(500))
    file_url = Column(String(500))
    duration_minutes = Column(Integer)
    is_published = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False)
    modified_at = Column(DateTime, nullable=False)

    translations = relationship("EducationMaterialTranslation", back_populates="material", cascade="all, delete-orphan")
    levels = relationship("EducationMaterialLevel", back_populates="material", cascade="all, delete-orphan")
    quiz = relationship("EducationQuiz", back_populates="material", uselist=False, cascade="all, delete-orphan")
