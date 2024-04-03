from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


class Mesaage(BaseModel):
    message : str

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/search/{id}/")
def search(id: int):
    if id==9922:
        return {"id": "Ehetsham"}
    else:
        return {"id": "Lakshya"}

@app.post("/chats/{userid}")
def chat(userid:int,message : Mesaage):
    print("UserID :",userid)
    print("Message :", message.message)
    return {"data": f"received message '{message.message}' from user {userid}"}
