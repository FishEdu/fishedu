from fastapi import APIRouter, HTTPException

from database import SessionLocal
from models import RecipesPlTranslations, RecipesEnTranslations

router = APIRouter(
    prefix="/api/v1/recipes",
    tags=["recipes"]
)


@router.get("")
def get_recipes(language: str):
    db = SessionLocal()

    try:
        translation_table = {
            "pl": RecipesPlTranslations,
            "en": RecipesEnTranslations
        }.get(language)

        if not translation_table:
            raise HTTPException(
                status_code=400,
                detail="Unsupported language"
            )

        results = db.query(translation_table).all()

        return [
            {
                "id": recipe.id,
                "recipe_id": recipe.recipe_id,
                "name": recipe.name,
                "content": recipe.content
            }
            for recipe in results
        ]

    finally:
        db.close()