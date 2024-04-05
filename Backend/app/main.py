from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import schemas
# from .recommend import response
# from datetime import datetime
# from .database import insert,read
from .routers import chats

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chats.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/users/{userid}/")
def get_user(userid:int):
    return {"data": userid}