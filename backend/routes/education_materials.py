from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import selectinload

from auth import get_current_user, get_current_user_optional
from database import SessionLocal
from models import (
    EducationMaterial,
    EducationMaterialLevel,
    EducationMaterialTranslation,
    EducationQuiz,
    EducationQuizOption,
    EducationQuizQuestion,
    FavoriteEducationMaterial,
    User,
)
from schemas.education import EducationLevel, EducationMaterialType, QuizSubmissionRequest


router = APIRouter(
    prefix="/api/v1/education-materials",
    tags=["education materials"]
)


def get_material_options():
    return (
        selectinload(EducationMaterial.translations),
        selectinload(EducationMaterial.levels),
        selectinload(EducationMaterial.quiz)
        .selectinload(EducationQuiz.questions)
        .selectinload(EducationQuizQuestion.translations),
        selectinload(EducationMaterial.quiz)
        .selectinload(EducationQuiz.questions)
        .selectinload(EducationQuizQuestion.options)
        .selectinload(EducationQuizOption.translations),
    )


def find_translation(translations, language: str):
    return next((translation for translation in translations if translation.language == language), None)


def serialize_quiz(quiz: EducationQuiz | None, language: str):
    if not quiz:
        return None

    questions = []
    for question in sorted(quiz.questions, key=lambda item: item.position):
        translation = find_translation(question.translations, language)
        if not translation:
            continue

        options = []
        for option in sorted(question.options, key=lambda item: item.position):
            option_translation = find_translation(option.translations, language)
            if option_translation:
                options.append({"id": option.id, "content": option_translation.content})

        questions.append({
            "id": question.id,
            "content": translation.content,
            "options": options,
        })

    return {
        "id": quiz.id,
        "passing_score": quiz.passing_score,
        "questions": questions,
    }


def serialize_material(material: EducationMaterial, language: str, is_favorite: bool = False, include_quiz: bool = False):
    translation = find_translation(material.translations, language)
    if not translation:
        return None

    result = {
        "id": material.id,
        "type": material.material_type,
        "title": translation.title,
        "description": translation.description,
        "image_url": material.image_url,
        "file_url": material.file_url,
        "duration_minutes": material.duration_minutes,
        "levels": [item.level for item in material.levels],
        "is_favorite": is_favorite,
    }

    if include_quiz:
        result["content"] = translation.content
        result["quiz"] = serialize_quiz(material.quiz, language)

    return result


def get_favorite_ids(db, user_id: int | None, material_ids: list[int]):
    if not user_id or not material_ids:
        return set()

    return {
        favorite.material_id
        for favorite in db.query(FavoriteEducationMaterial)
        .filter(FavoriteEducationMaterial.user_id == user_id)
        .filter(FavoriteEducationMaterial.material_id.in_(material_ids))
        .all()
    }


def get_material_or_404(db, material_id: int):
    material = (
        db.query(EducationMaterial)
        .options(*get_material_options())
        .filter(EducationMaterial.id == material_id)
        .filter(EducationMaterial.is_published.is_(True))
        .first()
    )
    if not material:
        raise HTTPException(status_code=404, detail="Education material not found")
    return material


@router.get("")
def get_education_materials(
    language: Literal["pl", "en"] = "pl",
    material_type: str | None = Query(default=None, alias="type"),
    level: EducationLevel | None = None,
    query: str | None = Query(default=None, min_length=1, max_length=100),
    current_user: User | None = Depends(get_current_user_optional),
):
    db = SessionLocal()
    try:
        materials_query = (
            db.query(EducationMaterial)
            .join(EducationMaterialTranslation)
            .filter(EducationMaterial.is_published.is_(True))
            .filter(EducationMaterialTranslation.language == language)
        )

        if material_type:
            material_types = set(material_type.split(","))
            allowed_types = {item.value for item in EducationMaterialType}
            if not material_types.issubset(allowed_types):
                raise HTTPException(status_code=400, detail="Unsupported material type")
            materials_query = materials_query.filter(EducationMaterial.material_type.in_(material_types))

        if level:
            materials_query = (
                materials_query.join(EducationMaterialLevel)
                .filter(EducationMaterialLevel.level == level.value)
            )

        if query:
            phrase = f"%{query.strip()}%"
            materials_query = materials_query.filter(
                or_(
                    EducationMaterialTranslation.title.ilike(phrase),
                    EducationMaterialTranslation.description.ilike(phrase),
                    EducationMaterialTranslation.content.ilike(phrase),
                )
            )

        materials = materials_query.options(*get_material_options()).order_by(EducationMaterial.id.desc()).all()
        favorite_ids = get_favorite_ids(db, current_user.id if current_user else None, [material.id for material in materials])

        return [
            serialize_material(material, language, material.id in favorite_ids)
            for material in materials
        ]
    finally:
        db.close()


@router.get("/favorites")
def get_favorite_education_materials(
    language: Literal["pl", "en"] = "pl",
    current_user: User = Depends(get_current_user),
):
    db = SessionLocal()
    try:
        materials = (
            db.query(EducationMaterial)
            .join(FavoriteEducationMaterial)
            .join(EducationMaterialTranslation)
            .filter(FavoriteEducationMaterial.user_id == current_user.id)
            .filter(EducationMaterial.is_published.is_(True))
            .filter(EducationMaterialTranslation.language == language)
            .options(*get_material_options())
            .order_by(FavoriteEducationMaterial.created_at.desc())
            .all()
        )
        return [serialize_material(material, language, is_favorite=True) for material in materials]
    finally:
        db.close()


@router.get("/{material_id}")
def get_education_material(
    material_id: int,
    language: Literal["pl", "en"] = "pl",
    current_user: User | None = Depends(get_current_user_optional),
):
    db = SessionLocal()
    try:
        material = get_material_or_404(db, material_id)
        favorite_ids = get_favorite_ids(db, current_user.id if current_user else None, [material.id])
        return serialize_material(
            material,
            language,
            material.id in favorite_ids,
            include_quiz=True,
        )
    finally:
        db.close()


@router.put("/{material_id}/favorite", status_code=status.HTTP_201_CREATED)
def add_favorite_education_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
):
    db = SessionLocal()
    try:
        get_material_or_404(db, material_id)
        existing_favorite = (
            db.query(FavoriteEducationMaterial)
            .filter(FavoriteEducationMaterial.user_id == current_user.id)
            .filter(FavoriteEducationMaterial.material_id == material_id)
            .first()
        )
        if not existing_favorite:
            db.add(FavoriteEducationMaterial(
                user_id=current_user.id,
                material_id=material_id,
                created_at=datetime.now(timezone.utc),
            ))
            db.commit()
        return {"material_id": material_id, "is_favorite": True}
    finally:
        db.close()


@router.delete("/{material_id}/favorite")
def remove_favorite_education_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
):
    db = SessionLocal()
    try:
        favorite = (
            db.query(FavoriteEducationMaterial)
            .filter(FavoriteEducationMaterial.user_id == current_user.id)
            .filter(FavoriteEducationMaterial.material_id == material_id)
            .first()
        )
        if favorite:
            db.delete(favorite)
            db.commit()
        return {"material_id": material_id, "is_favorite": False}
    finally:
        db.close()


@router.post("/{material_id}/quiz/submit")
def submit_quiz_answers(material_id: int, submission: QuizSubmissionRequest):
    db = SessionLocal()
    try:
        material = get_material_or_404(db, material_id)
        if material.material_type != EducationMaterialType.QUIZ.value or not material.quiz:
            raise HTTPException(status_code=400, detail="Material is not a quiz")

        questions = {question.id: question for question in material.quiz.questions}
        submitted_answers = {answer.question_id: answer.option_id for answer in submission.answers}
        correct_answers = 0

        for question_id, option_id in submitted_answers.items():
            question = questions.get(question_id)
            if not question:
                raise HTTPException(status_code=400, detail="Question does not belong to this quiz")

            option = next((item for item in question.options if item.id == option_id), None)
            if not option:
                raise HTTPException(status_code=400, detail="Option does not belong to this question")
            if option.is_correct:
                correct_answers += 1

        total_questions = len(questions)
        score = round((correct_answers / total_questions) * 100) if total_questions else 0
        return {
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "score": score,
            "passed": score >= material.quiz.passing_score,
        }
    finally:
        db.close()
