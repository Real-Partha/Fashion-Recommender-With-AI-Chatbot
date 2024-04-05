from fastapi import APIRouter
from .. import schemas

router = APIRouter(
    prefix="/users", tags=["chats"]
)

@router.get("/{userid}/")
def get_user(userid:int):
    return {"data": userid}

@router.post("/")
def create_user(user:schemas.User):
    return {"data": user}