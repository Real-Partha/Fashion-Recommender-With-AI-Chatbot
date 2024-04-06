from pydantic import BaseModel

class Message(BaseModel):
    message: str

class BaseUser(BaseModel):
    id: int
    email: str

class User(BaseUser):
    name : str
    age : int
    mobile : int

class UserAuth(User):
    password: str

class TokenData(BaseUser):
    token: str
    