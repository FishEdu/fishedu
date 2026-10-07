from sqlalchemy import Column, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from database import Base


class EducationQuizOptionTranslation(Base):
    __tablename__ = "education_quiz_option_translations"
    __table_args__ = (UniqueConstraint("option_id", "language", name="uq_education_quiz_option_translation"),)

    id = Column(Integer, primary_key=True)
    option_id = Column(Integer, ForeignKey("education_quiz_options.id", ondelete="CASCADE"), nullable=False)
    language = Column(String(2), nullable=False)
    content = Column(Text, nullable=False)

    option = relationship("EducationQuizOption", back_populates="translations")
