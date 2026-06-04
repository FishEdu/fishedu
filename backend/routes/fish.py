from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import Fish
from models import FishPlTranslations
from models import FishEnTranslations

router = APIRouter(
    prefix="/api/v1/fish",
    tags=["fish"]
)

@router.get("/{name}")
def get_fish(name: str, language: str):

    db = SessionLocal()

    try:

        translation_table = {
            "pl": FishPlTranslations,
            "en": FishEnTranslations
        }.get(language)

        if not translation_table:
            raise HTTPException(
                status_code=400,
                detail="Unsupported language"
            )

        fish = (
            db.query(Fish, translation_table)
            .join(
                translation_table,
                Fish.id == translation_table.fish_id
            )
            .filter(
                translation_table.name.ilike(name)
            )
            .first()
        )

        if not fish:
            raise HTTPException(
                status_code=404,
                detail="Fish not found"
            )

        return fish

    finally:
        db.close()

@router.get("")
def get_all_fish(language: str):

    db = SessionLocal()

    try:

        translation_table = {
            "pl": FishPlTranslations,
            "en": FishEnTranslations
        }.get(language)

        if not translation_table:
            raise HTTPException(
                status_code=400,
                detail="Unsupported language"
            )

        fishes = (
            db.query(Fish, translation_table)
            .join(
                translation_table,
                Fish.id == translation_table.fish_id
            )
            .all()
        )

        return fishes

    finally:
        db.close()