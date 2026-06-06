from fastapi import FastAPI
from routes.users import router as user_router
from routes.fish import router as fish_router

app = FastAPI()

app.include_router(user_router)
app.include_router(fish_router)