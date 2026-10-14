from enum import Enum

from pydantic import BaseModel, Field


class EducationMaterialType(str, Enum):
    VIDEO = "video"
    PDF = "pdf"
    COURSE = "course"
    QUIZ = "quiz"
    GUIDE = "guide"


class EducationLevel(str, Enum):
    BEGINNER = "beginner"
    ADVANCED = "advanced"


class QuizAnswer(BaseModel):
    question_id: int
    option_id: int


class QuizSubmissionRequest(BaseModel):
    answers: list[QuizAnswer] = Field(min_length=1)
