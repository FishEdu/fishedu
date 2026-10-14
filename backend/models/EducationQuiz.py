from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database import Base


class EducationQuiz(Base):
    __tablename__ = "education_quizzes"

    id = Column(Integer, primary_key=True)
    material_id = Column(Integer, ForeignKey("education_materials.id", ondelete="CASCADE"), nullable=False, unique=True)
    passing_score = Column(Integer, nullable=False, default=0)

    material = relationship("EducationMaterial", back_populates="quiz")
    questions = relationship("EducationQuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
