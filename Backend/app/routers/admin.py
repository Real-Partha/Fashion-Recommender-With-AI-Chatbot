from fastapi import APIRouter, status, HTTPException, Depends
from .. import schemas, oauth2
from ..encrypt import hash_password
from ..database import create_admin, get_adminbyid, get_adminbycondition
from datetime import datetime
import re

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/", response_model=schemas.Admin, status_code=status.HTTP_200_OK)
def fetchadminbytoken(current_user: schemas.Admin = Depends(oauth2.get_current_admin)):
    data = get_adminbyid(int(current_user["adminid"]))
    if data:
        return data
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin Not Found with userid or username: " + current_user["userid"],
        )

@router.post("/", response_model=schemas.Message, status_code=status.HTTP_201_CREATED)
def createadmin(user: schemas.AcceptAdmin):
    email = user.email
    password = user.password
    username = user.username
    name = user.name
    age = user.age
    mobile = user.mobile
    encrypted_password = hash_password(password)
    count = 0
    temp_adminid = int(datetime.now().strftime("%Y%m%d") + f"{count:03d}")
    while get_adminbyid(temp_adminid):
        count += 1
        temp_adminid = int(datetime.now().strftime("%Y%m%d") + f"{count:03d}")

    if get_adminbycondition({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email Exists",
        )
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Email",
        )

    if get_adminbycondition({"username": username}):
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
        "adminid": temp_adminid,
        "email": email,
        "password": encrypted_password,
        "username": username,
        "name": name,
        "age": age,
        "mobile": mobile,
    }
    if create_admin(data):
        return {"message": "Admin Created with id " + str(temp_adminid)}
    else:
        return {"message": "Admin Creation Failed....Try Again Later...."}
