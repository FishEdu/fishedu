from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import Fish, FishPlTranslations, FishEnTranslations

router = APIRouter(
    prefix="/api/v1/fish",
    tags=["fish"]
)


# =========================
# GET SINGLE FISH
# =========================
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

        result = (
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

        if not result:
            raise HTTPException(
                status_code=404,
                detail="Fish not found"
            )

        fish, translation = result

        return {
            "id": fish.id,
            "min_protection_length": fish.min_protection_length,
            "max_protection_length": fish.max_protection_length,
            "is_endangered": fish.is_endangered,

            "name": translation.name,
            "description": translation.description,
            "appearance": translation.appearance,
            "feeding_places": translation.feeding_places,
            "preferences": translation.preferences,
            "handling": translation.handling,
        }

    finally:
        db.close()


# =========================
# GET ALL FISH
# =========================
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

        results = (
            db.query(Fish, translation_table)
            .join(
                translation_table,
                Fish.id == translation_table.fish_id
            )
            .all()
        )

        return [
            {
                "id": fish.id,
                "min_protection_length": fish.min_protection_length,
                "max_protection_length": fish.max_protection_length,
                "is_endangered": fish.is_endangered,

                "name": translation.name,
                "description": translation.description,
                "appearance": translation.appearance,
                "feeding_places": translation.feeding_places,
                "preferences": translation.preferences,
                "handling": translation.handling,
            }
            for fish, translation in results
        ]

    finally:
        db.close()