from datetime import datetime, timezone
import os

from database import SessionLocal
from models import (
    EducationMaterial,
    EducationMaterialLevel,
    EducationMaterialTranslation,
    EducationQuiz,
    EducationQuizOption,
    EducationQuizOptionTranslation,
    EducationQuizQuestion,
    EducationQuizQuestionTranslation,
)


PUBLIC_MEDIA_URL = os.getenv("FISHEDU_MEDIA_URL", "http://192.168.101.16:8000/media")

MATERIALS = [
    {
        "type": "pdf",
        "title": "Dobór sprzętu wędkarskiego",
        "description": "Przykładowy poradnik PDF dla początkujących.",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non dui id augue ultricies ullamcorper.",
        "file_url": f"{PUBLIC_MEDIA_URL}/pdfs/dobor-sprzetu-wedkarskiego.pdf",
        "levels": ["beginner"],
    },
    {
        "type": "guide",
        "title": "Porady ekologiczne",
        "description": "Przykładowy poradnik o odpowiedzialnym wędkowaniu.",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur volutpat nunc at ultrices semper.",
        "file_url": None,
        "levels": ["beginner", "advanced"],
    },
    {
        "type": "guide",
        "title": "Słownik wędkarski",
        "description": "Przykładowe pojęcia dla osób, które zaczynają przygodę z wędkarstwem.",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer finibus augue non purus vulputate.",
        "file_url": None,
        "levels": ["beginner"],
    },
    {
        "type": "pdf",
        "title": "Przepisy na zanęty i przynęty",
        "description": "Przykładowy materiał PDF z prostymi mieszankami.",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus.",
        "file_url": f"{PUBLIC_MEDIA_URL}/pdfs/przepisy-na-zanety-i-przynety.pdf",
        "levels": ["beginner"],
    },
    {
        "type": "quiz",
        "title": "Quiz: pierwsze kroki nad wodą",
        "description": "Trzy krótkie pytania dla osób rozpoczynających wędkowanie.",
        "content": "Sprawdź podstawy odpowiedzialnego zachowania nad wodą.",
        "file_url": None,
        "levels": ["beginner"],
        "quiz": {
            "passing_score": 67,
            "questions": [
                {
                    "content": "Co należy zrobić z odpadkami po wędkowaniu?",
                    "options": [
                        ("Zabrać je ze sobą i wyrzucić w odpowiednim miejscu", True),
                        ("Zostawić je przy stanowisku", False),
                        ("Wrzuć je do wody", False),
                    ],
                },
                {
                    "content": "Jak najlepiej obchodzić się z rybą przed jej wypuszczeniem?",
                    "options": [
                        ("Zwilżyć dłonie i ograniczyć czas poza wodą", True),
                        ("Położyć ją na suchym piasku", False),
                        ("Trzymać ją jak najdłużej do zdjęcia", False),
                    ],
                },
                {
                    "content": "Po co warto znać regulamin łowiska?",
                    "options": [
                        ("Aby znać zasady i chronić ryby oraz środowisko", True),
                        ("Tylko po to, aby wybrać przynętę", False),
                        ("Regulamin nie ma znaczenia", False),
                    ],
                },
            ],
        },
    },
    {
        "type": "quiz",
        "title": "Quiz: świadome wędkowanie",
        "description": "Przykładowy quiz dla bardziej doświadczonych wędkarzy.",
        "content": "Sprawdź, czy pamiętasz dobre praktyki nad wodą.",
        "file_url": None,
        "levels": ["advanced"],
        "quiz": {
            "passing_score": 67,
            "questions": [
                {
                    "content": "Które działanie najmniej ingeruje w brzeg łowiska?",
                    "options": [
                        ("Korzystanie z istniejącego dojścia", True),
                        ("Wycinanie roślinności przy stanowisku", False),
                        ("Rozpalanie ogniska w trzcinach", False),
                    ],
                },
                {
                    "content": "Co należy zrobić, gdy zauważysz zanieczyszczenie wody?",
                    "options": [
                        ("Zgłosić je odpowiednim służbom lub gospodarzowi łowiska", True),
                        ("Zignorować je", False),
                        ("Przenieść je w inne miejsce nad brzegiem", False),
                    ],
                },
                {
                    "content": "Dlaczego warto używać maty do odhaczania ryby?",
                    "options": [
                        ("Chroni rybę przed urazami", True),
                        ("Ułatwia ważenie sprzętu", False),
                        ("Zastępuje podbierak", False),
                    ],
                },
            ],
        },
    },
]


def create_quiz(quiz_data):
    quiz = EducationQuiz(passing_score=quiz_data["passing_score"])

    for question_position, question_data in enumerate(quiz_data["questions"], start=1):
        question = EducationQuizQuestion(position=question_position)
        question.translations.append(EducationQuizQuestionTranslation(
            language="pl",
            content=question_data["content"],
        ))

        for option_position, (content, is_correct) in enumerate(question_data["options"], start=1):
            option = EducationQuizOption(position=option_position, is_correct=is_correct)
            option.translations.append(EducationQuizOptionTranslation(language="pl", content=content))
            question.options.append(option)

        quiz.questions.append(question)

    return quiz


def seed_materials():
    db = SessionLocal()
    try:
        for item in MATERIALS:
            existing = (
                db.query(EducationMaterial)
                .join(EducationMaterialTranslation)
                .filter(EducationMaterialTranslation.language == "pl")
                .filter(EducationMaterialTranslation.title == item["title"])
                .first()
            )
            if existing:
                continue

            now = datetime.now(timezone.utc)
            material = EducationMaterial(
                material_type=item["type"],
                file_url=item["file_url"],
                is_published=True,
                created_at=now,
                modified_at=now,
            )
            material.translations.append(EducationMaterialTranslation(
                language="pl",
                title=item["title"],
                description=item["description"],
                content=item["content"],
            ))
            material.levels.extend(EducationMaterialLevel(level=level) for level in item["levels"])
            if item.get("quiz"):
                material.quiz = create_quiz(item["quiz"])
            db.add(material)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_materials()
