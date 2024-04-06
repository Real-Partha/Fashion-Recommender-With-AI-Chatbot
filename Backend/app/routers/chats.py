from fastapi import APIRouter
from .. import schemas
from ..recommend import response
from datetime import datetime
from ..database import insert, read, update

router = APIRouter(
    prefix="/chats", tags=["chats"]
)

@router.get("/{userid}/")
def chat(userid:int):
    curr_data = list(read(userid))
    if len(curr_data) == 0:
        return {"exists": False}
    db_data = {}
    db_data["exists"] = True
    for data in curr_data:
        db_data[data["date"]] = data["chats"]
    return db_data

@router.post("/{userid}/")
def chat(userid:int ,message:schemas.Message):
    curr_data = read(userid)
    curr_date = datetime.now().strftime("%d-%m-%Y")
    curr_time = datetime.now().strftime("%H:%M")
    db_data = list(curr_data)
    flag=False
    for data in db_data:
        if data["userid"] == userid:
            if data["date"] == curr_date:
                flag=True
                update(userid,curr_date,{curr_time:message.message})
    if flag == False:
        insert({"userid":userid,"date":curr_date,"chats":[{curr_time:message.message}]})
    try:
        response_text = response(message.message)
    except:
        response_text = "Sorry, I didn't understand that."
    # response_text = "Test" + " at " + curr_date + curr_time
    update(userid,curr_date,{curr_time:response_text})
    return {"data": response_text}
