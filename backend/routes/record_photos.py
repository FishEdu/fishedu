from pathlib import Path
import re
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse


router = APIRouter(prefix="/api/v1/records/photos", tags=["records"])

RECORD_PHOTOS_DIR = Path(__file__).resolve().parents[1] / "uploads" / "records"
MAX_PHOTO_SIZE = 5 * 1024 * 1024
PHOTO_MEDIA_TYPES = {"jpg": "image/jpeg", "png": "image/png", "webp": "image/webp"}


def get_photo_extension(data: bytes) -> str:
    if data.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        return "webp"
    raise HTTPException(status_code=415, detail="Use a JPEG, PNG or WebP photo")


@router.post("", status_code=201)
def upload_record_photo(file: UploadFile = File(...)):
    try:
        data = file.file.read(MAX_PHOTO_SIZE + 1)
    finally:
        file.file.close()

    if len(data) > MAX_PHOTO_SIZE:
        raise HTTPException(status_code=413, detail="Photo must be smaller than 5 MB")

    extension = get_photo_extension(data)
    filename = f"{uuid4().hex}.{extension}"
    RECORD_PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    (RECORD_PHOTOS_DIR / filename).write_bytes(data)

    return {"image_url": f"{router.prefix}/{filename}"}


@router.get("/{filename}")
def get_record_photo(filename: str):
    if not re.fullmatch(r"[a-f0-9]{32}\.(jpg|png|webp)", filename):
        raise HTTPException(status_code=404, detail="Photo not found")

    photo_path = RECORD_PHOTOS_DIR / filename
    if not photo_path.is_file():
        raise HTTPException(status_code=404, detail="Photo not found")

    return FileResponse(
        photo_path,
        media_type=PHOTO_MEDIA_TYPES[photo_path.suffix[1:]],
        headers={"X-Content-Type-Options": "nosniff"},
    )
