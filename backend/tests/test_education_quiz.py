import unittest
from types import SimpleNamespace
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from auth import get_current_user_optional
from routes.education_materials import router, serialize_quiz


def translation(language, content):
    return SimpleNamespace(language=language, content=content)


def sample_quiz():
    return SimpleNamespace(
        id=7,
        passing_score=67,
        questions=[SimpleNamespace(
            id=10,
            position=1,
            translations=[translation("pl", "Pytanie"), translation("en", "Question")],
            options=[
                SimpleNamespace(id=12, position=2, is_correct=False, translations=[
                    translation("pl", "Bledna"), translation("en", "Wrong"),
                ]),
                SimpleNamespace(id=11, position=1, is_correct=True, translations=[
                    translation("pl", "Poprawna"), translation("en", "Correct"),
                ]),
            ],
        )],
    )


class EducationQuizTests(unittest.TestCase):
    def test_serialization_includes_correct_answers_and_threshold(self):
        result = serialize_quiz(sample_quiz(), "pl")
        self.assertEqual(result["passing_score"], 67)
        self.assertEqual(result["questions"][0]["options"], [
            {"id": 11, "content": "Poprawna", "is_correct": True},
            {"id": 12, "content": "Bledna", "is_correct": False},
        ])

    def test_english_translation_keeps_the_same_correct_answers(self):
        result = serialize_quiz(sample_quiz(), "en")
        self.assertEqual(result["questions"][0]["content"], "Question")
        self.assertTrue(result["questions"][0]["options"][0]["is_correct"])

    def test_missing_question_translation_does_not_return_a_partial_quiz(self):
        quiz = sample_quiz()
        quiz.questions[0].translations = []
        self.assertIsNone(serialize_quiz(quiz, "pl"))

    def test_missing_option_translation_does_not_return_a_partial_quiz(self):
        quiz = sample_quiz()
        quiz.questions[0].options[1].translations = []
        self.assertIsNone(serialize_quiz(quiz, "pl"))

    def test_empty_quiz_is_not_available(self):
        quiz = sample_quiz()
        quiz.questions = []
        self.assertIsNone(serialize_quiz(quiz, "pl"))
        self.assertIsNone(serialize_quiz(None, "pl"))

    def test_detail_endpoint_returns_everything_needed_for_local_grading(self):
        material = SimpleNamespace(
            id=42, material_type="quiz", image_url=None, file_url=None,
            duration_minutes=None, levels=[], quiz=sample_quiz(),
            translations=[SimpleNamespace(
                language="pl", title="Quiz", description="Description", content=None,
            )],
        )
        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user_optional] = lambda: None
        with patch("routes.education_materials.SessionLocal") as session_factory, \
                patch("routes.education_materials.get_material_or_404", return_value=material):
            with TestClient(app) as client:
                response = client.get("/api/v1/education-materials/42?language=pl")
            self.assertEqual(response.status_code, 200)
            quiz = response.json()["quiz"]
            self.assertEqual(quiz["passing_score"], 67)
            self.assertEqual(len(quiz["questions"]), 1)
            self.assertTrue(quiz["questions"][0]["options"][0]["is_correct"])
            session_factory.return_value.close.assert_called_once()

    def test_list_accepts_type_filter_using_its_public_query_name(self):
        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user_optional] = lambda: None
        with patch("routes.education_materials.SessionLocal") as session_factory:
            query = session_factory.return_value.query.return_value
            for method in ("join", "filter", "options", "order_by"):
                getattr(query, method).return_value = query
            query.all.return_value = []
            with TestClient(app) as client:
                response = client.get("/api/v1/education-materials?language=pl&type=quiz")
            self.assertEqual(response.status_code, 200)
            parameters = [value for call in query.filter.call_args_list
                          for value in call.args[0].compile().params.values()]
            self.assertIn(["quiz"], parameters)

    def test_all_levels_are_requested_by_omitting_the_level_parameter(self):
        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user_optional] = lambda: None
        with patch("routes.education_materials.SessionLocal") as session_factory:
            query = session_factory.return_value.query.return_value
            for method in ("join", "filter", "options", "order_by"):
                getattr(query, method).return_value = query
            query.all.return_value = []
            with TestClient(app) as client:
                self.assertEqual(client.get("/api/v1/education-materials?language=pl").status_code, 200)
                self.assertEqual(client.get("/api/v1/education-materials?language=pl&level=all").status_code, 422)
            self.assertEqual(query.join.call_count, 1)


if __name__ == "__main__":
    unittest.main()
