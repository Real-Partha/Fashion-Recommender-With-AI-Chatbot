import os
from datetime import datetime

from fastapi import APIRouter, Depends, Form, UploadFile

from .. import oauth2, schemas
from ..database import insert, read, update
from ..recommend import response
from ..img_predict import get_image

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
    print("Message Received :",message)
    # Update text message in database
    if message is not None:
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
    file = ""
    # Process image if provided
    if image is not None:
        # Save image to file
        os.makedirs("../Frontend/public/images", exist_ok=True)
        file = str(userid) + datetime.now().strftime("%H%M%S") + image.filename
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
    if message != None and image != None:
        response_data_msg = response(message)
        response_data_img = get_image(f"../Frontend/public/images/{file}")
        if response_data_msg["type"]=="product":
            merged_product = []
            merged_product.extend(response_data_msg["data"][:3])
            merged_product.extend(response_data_img["data"][:2])
            merged_product.extend(response_data_msg["data"][3:])
            merged_product.extend(response_data_img["data"][2:])
            response_data = {
                "type": "product",
                "data": merged_product,
            }
        else:
            response_data = response_data_img
    
    elif message != None:
        try:
            response_data = response(message)
        except Exception as e:
            print(e)
            response_data = {
                "type": "text",
                "data": "Sorry, I am not able to understand this.",
            }
    else:
        response_data = get_image(f"../Frontend/public/images/{file}")
        # response_data = {
        #     "type": "text",
        #     "data": "Currently Recommendation using only image is in progress...Please Try Again Later...",
        # }

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
                "products": response_data["data"][:5],
                "role": "chatbot",
            },
        )
        return {"type": "product", "msg": "", "prod": response_data["data"]}
