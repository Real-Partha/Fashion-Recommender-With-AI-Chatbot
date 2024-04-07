from pydantic import BaseModel,EmailStr, AnyOf

class Message(BaseModel):
    message: str

class BaseUser(BaseModel):
    email: str
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
    email_or_username: AnyOf[str, EmailStr]
    password: str