from typing import Optional

from fastapi import APIRouter, HTTPException
from sqlalchemy import or_

from database import SessionLocal
from models import CatchRecord, FishEnTranslations, FishPlTranslations
from schemas.catch_record import CatchRecordRequest


router = APIRouter(
    prefix="/api/v1/records",
    tags=["records"]
)


def serialize_record(record: CatchRecord, translated_fish_name: Optional[str]):
    return {
        "id": record.id,
        "user_id": record.user_id,
        "fish_id": record.fish_id,
        "fish_name": record.fish_name or translated_fish_name,
        "fishing_spot": record.fishing_spot,
        "total_length": record.total_length,
        "fork_length": record.fork_length,
        "weight": record.weight,
        "description": record.description,
        "image_url": record.image_url,
        "created_at": record.created_at,
    }


@router.get("")
def get_records(
    language: str = "pl",
    mode: Optional[str] = None,
    query: Optional[str] = None
):
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

        records_query = (
            db.query(CatchRecord, translation_table.name)
            .outerjoin(
                translation_table,
                CatchRecord.fish_id == translation_table.fish_id
            )
            .order_by(CatchRecord.created_at.desc())
        )

        if query:
            search = f"%{query}%"

            if mode == "spots":
                records_query = records_query.filter(
                    CatchRecord.fishing_spot.ilike(search)
                )
            elif mode == "fish":
                records_query = records_query.filter(
                    or_(
                        CatchRecord.fish_name.ilike(search),
                        translation_table.name.ilike(search)
                    )
                )
            else:
                records_query = records_query.filter(
                    or_(
                        CatchRecord.fish_name.ilike(search),
                        translation_table.name.ilike(search),
                        CatchRecord.fishing_spot.ilike(search)
                    )
                )

        results = records_query.all()

        return [
            serialize_record(record, translated_fish_name)
            for record, translated_fish_name in results
        ]

    finally:
        db.close()


@router.post("")
def create_record(record: CatchRecordRequest):
    db = SessionLocal()

    try:
        if not record.fish_id and not record.fish_name:
            raise HTTPException(
                status_code=400,
                detail="Fish is required"
            )

        fish_name = record.fish_name


        if record.fish_id:
            fish_translation = (
                db.query(FishPlTranslations)
                .filter(
                    FishPlTranslations.fish_id == record.fish_id
                )
                .first()
            )

            if not fish_translation:
                raise HTTPException(
                    status_code=404,
                    detail="Fish translation not found"
                )

            fish_name = fish_translation.name


        new_record = CatchRecord(
            user_id=record.user_id,
            fish_id=record.fish_id,
            fish_name=fish_name,
            fishing_spot=record.fishing_spot,
            total_length=record.total_length,
            fork_length=record.fork_length,
            weight=record.weight,
            description=record.description,
            image_url=record.image_url,
        )

        db.add(new_record)
        db.commit()
        db.refresh(new_record)

        return serialize_record(new_record, record.fish_name)

    finally:
        db.close()

@router.delete("/{record_id}")
def delete_record(record_id: int):
    db = SessionLocal()

    try:
        record = (
            db.query(CatchRecord)
            .filter(CatchRecord.id == record_id)
            .first()
        )

        if not record:
            raise HTTPException(
                status_code=404,
                detail="Record not found"
            )

        db.delete(record)
        db.commit()

        return {
            "message": "Record deleted"
        }

    finally:
        db.close()

@router.put("/{record_id}")
def update_record(
    record_id: int,
    record_data: CatchRecordRequest
):
    db = SessionLocal()

    try:
        record = (
            db.query(CatchRecord)
            .filter(CatchRecord.id == record_id)
            .first()
        )

        if not record:
            raise HTTPException(
                status_code=404,
                detail="Record not found"
            )

        record.fish_id = record_data.fish_id
        record.fish_name = record_data.fish_name
        record.fishing_spot = record_data.fishing_spot
        record.total_length = record_data.total_length
        record.fork_length = record_data.fork_length
        record.weight = record_data.weight
        record.description = record_data.description
        record.image_url = record_data.image_url

        db.commit()
        db.refresh(record)

        return serialize_record(record, record.fish_name)

    finally:
        db.close()

