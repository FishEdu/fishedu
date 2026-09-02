from fastapi import FastAPI
from routes.users import router as user_router
from routes.fish import router as fish_router
from routes.eco_tips import router as eco_tips_router
from routes.recipes import router as recipes_router

app = FastAPI()

app.include_router(user_router)
app.include_router(fish_router)
app.include_router(eco_tips_router)
app.include_router(recipes_router)