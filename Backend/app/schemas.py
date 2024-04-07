from typing import Optional
from pydantic import BaseModel,EmailStr

class Message(BaseModel):
    message: str

class BaseUser(BaseModel):
    email: EmailStr
    username: str

class User(BaseUser):
    userid: int
    name : str
    age : int
    mobile : int

class Admin(BaseUser):
    adminid: int
    name : str
    age : int
    mobile : int    

class TokenData(BaseUser):
    token: str
    
class AcceptUser(BaseUser):
    password: str
    name : str
    age : int
    mobile : int

class AcceptAdmin(BaseUser):
    password: str
    name : str
    age : int
    mobile : int

class Login(BaseModel):
    credentials: str
    password: str

class LoginData(BaseModel):
    userid: int
    uername: Optional[str]
    email: Optional[EmailStr]
    token: str
