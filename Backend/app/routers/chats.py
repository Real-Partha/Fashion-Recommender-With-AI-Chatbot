from time import sleep
from fastapi import APIRouter, Depends, HTTPException, status
from .. import schemas,oauth2
from ..recommend import response
from datetime import datetime
from ..database import insert, read, update

router = APIRouter(
    prefix="/chats", tags=["chats"]
)

@router.get("/")
def chat(current_user: schemas.User = Depends(oauth2.get_current_user)):
    curr_data = list(read(current_user["userid"]))
    if len(curr_data) == 0:
        db_data = {"exists": False}
    else:
        db_data = {}
        db_data["exists"] = True
        for data in curr_data:
            db_data[data["date"]] = data["chats"]
    return {"user":current_user,"data":db_data}

@router.post("/")
def chat(message:schemas.Message,current_user: schemas.User = Depends(oauth2.get_current_user)):
    userid = current_user["userid"]
    curr_data = read(userid)
    curr_date = datetime.now().strftime("%d-%m-%Y")
    curr_time = datetime.now().strftime("%H:%M")
    db_data = list(curr_data)
    flag=False
    for data in db_data:
        if data["userid"] == userid:
            if data["date"] == curr_date:
                flag=True
                update(userid,curr_date,{"time":curr_time,"type":"text","message":message.message,"role":"user"})
    if flag == False:
        insert({"userid":userid,"date":curr_date,"chats":[{"time":curr_time,"type":"text","message":message.message,"role":"user"}]})
    # try:
    #     response_text = response(message.message)
    # except Exception as e:
    #     print(e)
    #     response_text = "Sorry, I didn't understand that."
    response_text = "Test" + " at " + curr_date + curr_time
    update(userid,curr_date,{"time":curr_time,"type":"text","message":response_text,"products":[],"role":"chatbot"})
    sleep(10)
    return {"data": response_text}
