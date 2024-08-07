from fastapi import APIRouter,HTTPException,status
from .. import schemas
from ..database import connect,token_entry
from ..encrypt import verify_password
from ..oauth2 import create_access_token

router = APIRouter(
    prefix="/auth", tags=["auth"]
)

def login_user(credentials,password):
    db = connect()
    collection = db["users"]
    data = collection.find_one({"email":credentials},{"_id":0,"email":1,"userid":1,"password":1})
    if data:
        if verify_password(password,data["password"]):
            del data["password"]
            return data
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect Password")
    else:
        data = collection.find_one({"username":credentials},{"_id":0,"username":1,"userid":1,"password":1})
        if data:
            if verify_password(password,data["password"]):
                del data["password"]
                return data
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect Password")
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Email or Username not found")
        
def login_admin(credentials,password):
    db = connect()
    collection = db["admins"]
    data = collection.find_one({"email":credentials},{"_id":0,"email":1,"adminid":1,"password":1})
    if data:
        if verify_password(password,data["password"]):
            del data["password"]
            return data
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect Password")
    else:
        data = collection.find_one({"username":credentials},{"_id":0,"username":1,"adminid":1,"password":1})
        if data:
            if verify_password(password,data["password"]):
                del data["password"]
                return data
            else:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Incorrect Password")
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Email or Username not found")

@router.post("/login/",status_code=status.HTTP_200_OK)
def userlogin(user: schemas.Login):
    data = login_user(user.credentials,user.password)
    if data:
        token = create_access_token(data)
        data["token"]=token
        return data
    
@router.post("/login/admin",status_code=status.HTTP_200_OK)
def adminlogin(user: schemas.Login):
    data = login_admin(user.credentials,user.password)
    if data:
        token = create_access_token(data)
        data["token"]=token
        return data
    
@router.post("/logout/",status_code=status.HTTP_200_OK)
def logout(token : schemas.TokenEntry):
    if token.status == "logout":
        token_entry(token.token,"expired")
    return {"message":"Logged Out"}

    