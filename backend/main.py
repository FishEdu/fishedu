import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes.users import router as user_router
from routes.fish import router as fish_router
from routes.eco_tips import router as eco_tips_router
from routes.recipes import router as recipes_router
from routes.education_materials import router as education_materials_router

app = FastAPI()

media_root = Path(os.getenv("FISHEDU_MEDIA_ROOT", Path.home() / "Desktop" / "FishEduStorage"))
media_root.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(media_root)), name="media")

app.include_router(user_router)
app.include_router(fish_router)
app.include_router(eco_tips_router)
app.include_router(recipes_router)
app.include_router(education_materials_router)
