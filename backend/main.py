from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables
from routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()