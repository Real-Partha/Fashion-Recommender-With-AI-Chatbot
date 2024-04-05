from pydantic import BaseModel

class Message(BaseModel):
    message: str

class User(BaseModel):
    email: str
    password: str
    name : str
    age : int
    mobile : int

class UserInDB(User):
    id: int
    token: str
