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
        "title_en": "Choosing fishing equipment",
        "description_en": "A sample PDF guide for beginners.",
        "content_en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non dui id augue ultricies ullamcorper.",
        "file_url": f"{PUBLIC_MEDIA_URL}/pdfs/dobor-sprzetu-wedkarskiego.pdf",
        "levels": ["beginner"],
    },
    {
        "type": "pdf",
        "title": "Przepisy na zanęty i przynęty",
        "description": "Przykładowy materiał PDF z prostymi mieszankami.",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus.",
        "title_en": "Groundbait and bait recipes",
        "description_en": "A sample PDF with simple mixes.",
        "content_en": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus.",
        "file_url": f"{PUBLIC_MEDIA_URL}/pdfs/przepisy-na-zanety-i-przynety.pdf",
        "levels": ["beginner"],
    },
    {
        "type": "video",
        "title": "Film: podstawy wędkowania",
        "description": "Krótki materiał demonstracyjny odtwarzany bezpośrednio w aplikacji.",
        "content": "Przykładowy film FishEdu. Zastąpimy go później właściwą lekcją wideo.",
        "title_en": "Video: fishing basics",
        "description_en": "A short demonstration video played directly in the app.",
        "content_en": "A sample FishEdu video. It will later be replaced with a full video lesson.",
        "image_url": f"{PUBLIC_MEDIA_URL}/images/podstawy-wedkarstwa-thumbnail.png",
        "file_url": f"{PUBLIC_MEDIA_URL}/videos/podstawy-wedkarstwa.mp4",
        "duration_minutes": 1,
        "levels": ["beginner"],
    },
    {
        "type": "quiz",
        "title": "Quiz: pierwsze kroki nad wodą",
        "description": "Trzy krótkie pytania dla osób rozpoczynających wędkowanie.",
        "content": "Sprawdź podstawy odpowiedzialnego zachowania nad wodą.",
        "title_en": "Quiz: first steps by the water",
        "description_en": "Three short questions for people starting their fishing adventure.",
        "content_en": "Check the basics of responsible behavior by the water.",
        "file_url": None,
        "levels": ["beginner"],
        "quiz": {
            "passing_score": 67,
            "questions": [
                {
                    "content": "Co należy zrobić z odpadkami po wędkowaniu?",
                    "content_en": "What should you do with waste after fishing?",
                    "options": [
                        ("Zabrać je ze sobą i wyrzucić w odpowiednim miejscu", "Take it with you and dispose of it properly", True),
                        ("Zostawić je przy stanowisku", "Leave it by the fishing spot", False),
                        ("Wrzuć je do wody", "Throw it into the water", False),
                    ],
                },
                {
                    "content": "Jak najlepiej obchodzić się z rybą przed jej wypuszczeniem?",
                    "content_en": "How should you handle a fish before releasing it?",
                    "options": [
                        ("Zwilżyć dłonie i ograniczyć czas poza wodą", "Wet your hands and minimize time out of the water", True),
                        ("Położyć ją na suchym piasku", "Place it on dry sand", False),
                        ("Trzymać ją jak najdłużej do zdjęcia", "Hold it as long as possible for a photo", False),
                    ],
                },
                {
                    "content": "Po co warto znać regulamin łowiska?",
                    "content_en": "Why is it worth knowing the fishery rules?",
                    "options": [
                        ("Aby znać zasady i chronić ryby oraz środowisko", "To know the rules and protect fish and the environment", True),
                        ("Tylko po to, aby wybrać przynętę", "Only to choose bait", False),
                        ("Regulamin nie ma znaczenia", "The rules do not matter", False),
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
        "title_en": "Quiz: mindful fishing",
        "description_en": "A sample quiz for more experienced anglers.",
        "content_en": "Check whether you remember good practices by the water.",
        "file_url": None,
        "levels": ["advanced"],
        "quiz": {
            "passing_score": 67,
            "questions": [
                {
                    "content": "Które działanie najmniej ingeruje w brzeg łowiska?",
                    "content_en": "Which action interferes least with the fishery bank?",
                    "options": [
                        ("Korzystanie z istniejącego dojścia", "Using an existing access path", True),
                        ("Wycinanie roślinności przy stanowisku", "Cutting vegetation at the fishing spot", False),
                        ("Rozpalanie ogniska w trzcinach", "Lighting a fire in the reeds", False),
                    ],
                },
                {
                    "content": "Co należy zrobić, gdy zauważysz zanieczyszczenie wody?",
                    "content_en": "What should you do if you notice water pollution?",
                    "options": [
                        ("Zgłosić je odpowiednim służbom lub gospodarzowi łowiska", "Report it to the relevant authorities or the fishery manager", True),
                        ("Zignorować je", "Ignore it", False),
                        ("Przenieść je w inne miejsce nad brzegiem", "Move it to another place on the bank", False),
                    ],
                },
                {
                    "content": "Dlaczego warto używać maty do odhaczania ryby?",
                    "content_en": "Why is it worth using an unhooking mat?",
                    "options": [
                        ("Chroni rybę przed urazami", "It protects the fish from injury", True),
                        ("Ułatwia ważenie sprzętu", "It makes weighing equipment easier", False),
                        ("Zastępuje podbierak", "It replaces a landing net", False),
                    ],
                },
            ],
        },
    },
    {
        "type": "quiz",
        "title": "Quiz: podstawy sprzętu wędkarskiego",
        "description": "Krótki quiz o podstawowym wyposażeniu początkującego wędkarza.",
        "content": "Sprawdź, czy rozpoznajesz najważniejsze elementy zestawu wędkarskiego.",
        "title_en": "Quiz: fishing equipment basics",
        "description_en": "A short quiz about basic equipment for a beginner angler.",
        "content_en": "Check whether you recognize the most important parts of a fishing setup.",
        "file_url": None,
        "levels": ["beginner"],
        "quiz": {
            "passing_score": 67,
            "questions": [
                {
                    "content": "Który element zestawu służy do nawinięcia żyłki?",
                    "content_en": "Which part of the setup holds the fishing line?",
                    "options": [
                        ("Kołowrotek", "Reel", True),
                        ("Podbierak", "Landing net", False),
                        ("Mata do odhaczania", "Unhooking mat", False),
                    ],
                },
                {
                    "content": "Do czego służy spławik?",
                    "content_en": "What is a float used for?",
                    "options": [
                        ("Sygnalizuje branie ryby", "It signals a fish bite", True),
                        ("Przechowuje przynętę", "It stores bait", False),
                        ("Czyści żyłkę", "It cleans the fishing line", False),
                    ],
                },
                {
                    "content": "Który element umieszcza się na końcu zestawu, aby zapiąć przynętę?",
                    "content_en": "Which item is placed at the end of the setup to attach bait?",
                    "options": [
                        ("Haczyk", "Hook", True),
                        ("Szczytówkę", "Rod tip", False),
                        ("Korbek kołowrotka", "Reel handle", False),
                    ],
                },
            ],
        },
    },
]


def add_or_update_translation(translations, translation_class, language, **values):
    translation = next((item for item in translations if item.language == language), None)
    if not translation:
        translation = translation_class(language=language, **values)
        translations.append(translation)
        return

    for field, value in values.items():
        setattr(translation, field, value)


def sync_quiz(quiz_data, quiz=None):
    quiz = quiz or EducationQuiz()
    quiz.passing_score = quiz_data["passing_score"]

    for question_position, question_data in enumerate(quiz_data["questions"], start=1):
        question = next((item for item in quiz.questions if item.position == question_position), None)
        if not question:
            question = EducationQuizQuestion(position=question_position)
            quiz.questions.append(question)

        add_or_update_translation(
            question.translations,
            EducationQuizQuestionTranslation,
            "pl",
            content=question_data["content"],
        )
        add_or_update_translation(
            question.translations,
            EducationQuizQuestionTranslation,
            "en",
            content=question_data["content_en"],
        )

        for option_position, (content, content_en, is_correct) in enumerate(question_data["options"], start=1):
            option = next((item for item in question.options if item.position == option_position), None)
            if not option:
                option = EducationQuizOption(position=option_position)
                question.options.append(option)

            option.is_correct = is_correct
            add_or_update_translation(
                option.translations,
                EducationQuizOptionTranslation,
                "pl",
                content=content,
            )
            add_or_update_translation(
                option.translations,
                EducationQuizOptionTranslation,
                "en",
                content=content_en,
            )

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
            now = datetime.now(timezone.utc)
            material = existing or EducationMaterial(created_at=now)
            material.material_type = item["type"]
            material.image_url = item.get("image_url")
            material.file_url = item["file_url"]
            material.duration_minutes = item.get("duration_minutes")
            material.is_published = True
            material.modified_at = now

            add_or_update_translation(
                material.translations,
                EducationMaterialTranslation,
                "pl",
                title=item["title"],
                description=item["description"],
                content=item["content"],
            )
            add_or_update_translation(
                material.translations,
                EducationMaterialTranslation,
                "en",
                title=item["title_en"],
                description=item["description_en"],
                content=item["content_en"],
            )
            material.levels[:] = [EducationMaterialLevel(level=level) for level in item["levels"]]
            if item.get("quiz"):
                material.quiz = sync_quiz(item["quiz"], material.quiz)

            if not existing:
                db.add(material)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_materials()
