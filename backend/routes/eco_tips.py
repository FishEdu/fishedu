from fastapi import APIRouter, HTTPException


from models import EcoTipsPlTranslations, EcoTipsEnTranslations
from database import SessionLocal

router = APIRouter(
    prefix="/api/v1/ecoTips",
    tags=["eco tips"]
)

@router.get('')
def get_eco_tips(language: str):
  db = SessionLocal()

  try:
    translation_table = {
      "pl": EcoTipsPlTranslations,
      "en": EcoTipsEnTranslations
    }.get(language)

    if not translation_table:
      raise HTTPException(
          status_code=400,
          detail="Unsupported language"
      )
    
    results = db.query(translation_table).all()
    return [
      {
        'id': translation.id,
        'title': translation.title,
        'description': translation.description
      } for translation in results
    ]

  finally:
    db.close()
