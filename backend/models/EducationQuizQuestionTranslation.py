from sqlalchemy import Column, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from database import Base


class EducationQuizQuestionTranslation(Base):
    __tablename__ = "education_quiz_question_translations"
    __table_args__ = (UniqueConstraint("question_id", "language", name="uq_education_quiz_question_translation"),)

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("education_quiz_questions.id", ondelete="CASCADE"), nullable=False)
    language = Column(String(2), nullable=False)
    content = Column(Text, nullable=False)

    question = relationship("EducationQuizQuestion", back_populates="translations")
