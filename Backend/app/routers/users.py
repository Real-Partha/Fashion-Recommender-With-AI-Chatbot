from fastapi import APIRouter, status, HTTPException, Depends
from .. import schemas, oauth2
from ..encrypt import hash_password
from ..database import create_user, get_userbyid, get_userbycondition
from datetime import datetime
import re

router = APIRouter(prefix="/users", tags=["chats"])


@router.get("/", response_model=schemas.User, status_code=status.HTTP_200_OK)
def fetchuserbytoken(current_user: schemas.User = Depends(oauth2.get_current_user)):
    data = get_userbyid(int(current_user["userid"]))
    if data:
        return data
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User Not Found with userid or username: " + current_user["userid"],
        )

@router.post("/", response_model=schemas.Message, status_code=status.HTTP_201_CREATED)
def createuser(user: schemas.AcceptUser):
    email = user.email
    password = user.password
    username = user.username
    name = user.name
    age = user.age
    mobile = user.mobile
    encrypted_password = hash_password(password)
    count = 0
    temp_userid = int(datetime.now().strftime("%Y%m%d") + f"{count:03d}")
    while get_userbyid(temp_userid):
        count += 1
        temp_userid = int(datetime.now().strftime("%Y%m%d") + f"{count:03d}")
        # if count > 100:
        #     return {"message": "User Creation Failed....Try Again Later...."}

    if get_userbycondition({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email Exists",
        )
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Email",
        )

    if get_userbycondition({"username": username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username Exists",
        )
    
    if len(password) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password Wrong",
        )

    data = {
        "userid": temp_userid,
        "email": email,
        "password": encrypted_password,
        "username": username,
        "name": name,
        "age": age,
        "mobile": mobile,
    }
    if create_user(data):
        return {"message": "User Created with id " + str(temp_userid)}
    else:
        return {"message": "User Creation Failed....Try Again Later...."}
