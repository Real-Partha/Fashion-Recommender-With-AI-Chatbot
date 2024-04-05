from fastapi import APIRouter
from .. import schemas
from ..recommend import response
from datetime import datetime
from ..database import insert,read


router = APIRouter(
    prefix="/chats", tags=["chats"]
)

@router.post("/{userid}/")
def chat(userid:int ,message:schemas.Message):
    curr_date = datetime.now().strftime("%d-%m-%Y")
    curr_time = datetime.now().strftime("%H:%M")
    curr_data = read(userid)
    if curr_data is None or curr_data == {}:
        curr_data = {f"{userid}":{curr_date:[{curr_time:message.message}]}}
    else:
        if curr_date not in curr_data[f"{userid}"]:
            curr_data[f"{userid}"][curr_date] = [{curr_time:message.message}]
        else:
            curr_data[f"{userid}"][curr_date].append({curr_time:message.message})
    response_text = response(message.message)
    # response_text = "Test" + " at " + curr_date + curr_time
    curr_data[f"{userid}"][curr_date].append({curr_time:response_text})
    insert(curr_data)
    return {"data": response_text}
    # return {"data": curr_data}

@router.get("/{userid}/")
def chat(userid:int):
    curr_data = read(userid)
    if curr_data is None or curr_data == {}:
        return {"data": "No chats found"}
    return curr_data