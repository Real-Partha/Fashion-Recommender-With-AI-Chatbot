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

class TokenData(BaseModel):
    id: int
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

class TokenVerify(BaseModel):
    token : str

class TokenEntry(BaseModel):
    token : str
    status : str

class Product(BaseModel):
    pid: int
    name: str
    price: float
    ofprice: float
    discount: float
    imglink: str

class AcceptOrder(BaseModel):
    recipientName : str
    address : str
    state : str
    pincode : int
    residenceType : str
    mobile : int
    paymentType : str
    product: Product
    total: float


class OrderView(AcceptOrder):
    orderid: str
    status: str
    date: str
    userid: int
    time: str