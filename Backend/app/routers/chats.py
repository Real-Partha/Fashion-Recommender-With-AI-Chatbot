from time import sleep
from fastapi import APIRouter, Depends, HTTPException, status,  File, UploadFile, Form
from .. import schemas, oauth2
from .. import schemas, oauth2
from ..recommend import response
from datetime import datetime
from ..database import insert, read, update
import os

router = APIRouter(prefix="/chats", tags=["chats"])


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
    return {"user": current_user, "data": db_data}

@router.post("/")
async def chat(
    message: str = Form(None),
    image: UploadFile = Form(None),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    userid = current_user["userid"]
    curr_date = datetime.now().strftime("%d-%m-%Y")
    curr_time = datetime.now().strftime("%H:%M")
    print(message)
    # Update text message in database
    flag = False
    db_data = read(userid)
    for data in db_data:
        if data["userid"] == userid and data["date"] == curr_date:
            flag = True
            update(
                userid,
                curr_date,
                {"time": curr_time, "type": "text", "message": message, "role": "user"},
            )
            break
    if not flag:
        insert(
            {
                "userid": userid,
                "date": curr_date,
                "chats": [
                    {
                        "time": curr_time,
                        "type": "text",
                        "message": message,
                        "role": "user",
                    }
                ],
            }
        )

    # Process image if provided
    if image is not None:
        # Save image to file
        os.makedirs("../Frontend/public/images", exist_ok=True)
        file = str(userid)+ datetime.now().strftime("%H%M%S")+image.filename
        with open(f"../Frontend/public/images/{file}", "wb") as f:
            f.write(image.file.read())

        # Update image message in database
        update(
            userid,
            curr_date,
            {
                "time": curr_time,
                "type": "image",
                "image": f"images/{file}",
                "role": "user",
            },
        )

    # Process text message and get response
    try:
        response_data = response(message)
    except Exception as e:
        print(e)
        response_data = {
            "type": "text",
            "data": "Sorry, I am not able to understand this.",
        }

    # Update database with response
    if response_data["type"] == "text":
        update(
            userid,
            curr_date,
            {
                "time": curr_time,
                "type": "text",
                "message": response_data["data"],
                "products": [],
                "role": "chatbot",
            },
        )
        return {"type": "text", "msg": response_data["data"], "prod": []}
    else:
        update(
            userid,
            curr_date,
            {
                "time": curr_time,
                "type": "product",
                "message": "",
                "products": response_data["data"],
                "role": "chatbot",
            },
        )
        return {"type": "product", "msg": "", "prod": response_data["data"]}
