from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import schemas
# from .recommend import response
# from datetime import datetime
# from .database import insert,read
from .routers import chats,users

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
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
