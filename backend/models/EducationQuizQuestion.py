from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database import Base


class EducationQuizQuestion(Base):
    __tablename__ = "education_quiz_questions"

    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey("education_quizzes.id", ondelete="CASCADE"), nullable=False)
    position = Column(Integer, nullable=False)

    quiz = relationship("EducationQuiz", back_populates="questions")
    translations = relationship("EducationQuizQuestionTranslation", back_populates="question", cascade="all, delete-orphan")
    options = relationship("EducationQuizOption", back_populates="question", cascade="all, delete-orphan")
