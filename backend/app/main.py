from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.client import connect_to_mongo, close_mongo_connection
from app.routers import auth, users, approval_rules, expenses, companies, health, ocr


app = FastAPI(title=settings.project_name, version=settings.version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    await connect_to_mongo()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    await close_mongo_connection()


app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(companies.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(approval_rules.router, prefix="/api")
app.include_router(expenses.router, prefix="/api")
app.include_router(ocr.router, prefix="/api")
