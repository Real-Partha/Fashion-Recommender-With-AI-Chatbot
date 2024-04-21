from jose import JWTError, jwt
from datetime import datetime, timedelta
from . import schemas
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from .database import get_userbyid,token_entry,verify_token,get_adminbyid
from .config import settings

oauth2_schema = OAuth2PasswordBearer(tokenUrl="login")


SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    token_entry(encoded_jwt,"active")
    return encoded_jwt


def verify_access_token(token: str):
    try:
        if not verify_token(token):
            print("Here 1")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has Expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        try:
            id: int = payload["userid"]
        except:
            id: int = payload["adminid"]

        if id == None:
            print("Here 2")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="You are not authorized",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = schemas.TokenData(userid=id, token=token)
    except Exception as e:
        print("Here 3")
        token_entry(token,"expired")
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token has Expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return token_data


def get_current_user(token: str = Depends(oauth2_schema)):
    token_data = verify_access_token(token)
    userid = token_data.userid
    user = get_userbyid(userid)
    return user

def get_current_admin(token: str = Depends(oauth2_schema)):
    token_data = verify_access_token(token)
    adminid = token_data.userid
    admin = get_adminbyid(adminid)
    return admin


