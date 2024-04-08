from fastapi import APIRouter,status,HTTPException
from .. import schemas
from ..encrypt import hash_password
from ..database import create_user, get_userbyid, get_userbycondition
from datetime import datetime

router = APIRouter(prefix="/users", tags=["chats"])


@router.get("/{cred}/",response_model=schemas.User, status_code=status.HTTP_200_OK)
def fetchuser(cred: str):
    if cred.isdigit():
        data = get_userbyid(int(cred))
    else:
        data = get_userbycondition({"username": cred})
    if data:
        return data
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Not Found with userid or username: " + cred)
    
@router.post("/",response_model=schemas.Message ,status_code=status.HTTP_201_CREATED)
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
        return {"message": "Email Already Exists....Try Again with Different Email...."}
    
    if get_userbycondition({"username": username}):
        return {"message": "Username Already Exists....Try Again with Different Username...."}
    

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
