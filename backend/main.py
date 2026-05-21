from fastapi import FastAPI
from backend.routes.users import router as user_router

app = FastAPI()

app.include_router(user_router)