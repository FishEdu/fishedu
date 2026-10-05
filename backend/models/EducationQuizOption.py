from sqlalchemy import Boolean, Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database import Base


class EducationQuizOption(Base):
    __tablename__ = "education_quiz_options"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("education_quiz_questions.id", ondelete="CASCADE"), nullable=False)
    position = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False, default=False)

    question = relationship("EducationQuizQuestion", back_populates="options")
    translations = relationship("EducationQuizOptionTranslation", back_populates="option", cascade="all, delete-orphan")
