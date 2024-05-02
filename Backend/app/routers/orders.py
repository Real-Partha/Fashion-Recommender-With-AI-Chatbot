from fastapi import APIRouter, Depends, HTTPException, status, Form
from .. import schemas, oauth2
from ..database import get_ordersbyid, get_orders_user, create_order, create_order_log, get_product_owner, get_pending_orders, approve_order
import time
import random
import string
from datetime import datetime

router = APIRouter(prefix="/orders", tags=["orders"])

@router.get("/user/")
def get_order_uid(current_user: schemas.User = Depends(oauth2.get_current_user)):
    userid = current_user["userid"]
    data = get_orders_user(int(userid))
    data = list(data)
    return data

@router.get("/{id}/")
def get_order_id(id: str, current_user: schemas.User = Depends(oauth2.get_current_user)):
    data = get_ordersbyid(id)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if data["userid"] == current_user["userid"]:
        return data
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not Authorized to view this order")


@router.post("/place/", status_code=status.HTTP_201_CREATED)
def place_order(order: schemas.AcceptOrder, current_user: schemas.User = Depends(oauth2.get_current_user)):
    data = order.model_dump()
    data["userid"] = current_user["userid"]
    data["status"] = "placed"
    temp_orderid = int(time.time() * 1000)
    random_chars = random.choices(string.ascii_lowercase, k=4)
    temp_orderid = f"{random_chars[0]}{random_chars[1]}{temp_orderid}{random_chars[2]}{random_chars[3]}"

    while get_ordersbyid(temp_orderid):
        random_chars = random.choices(string.ascii_lowercase, k=4)
        temp_orderid = temp_orderid = f"{random_chars[0]}{random_chars[1]}{temp_orderid[2:-2]}{random_chars[2]}{random_chars[3]}"
    data["orderid"] = temp_orderid
    current_date = datetime.now().strftime("%d-%m-%Y")
    data["date"] = current_date
    current_time = datetime.now().strftime("%H:%M:%S")
    data["time"] = current_time
    if create_order(data):
        order_data = {}
        order_data["orderid"] = temp_orderid
        order_data["adminid"] = get_product_owner(data["product"]["pid"])["adminid"]
        order_data["status"] = "placed"
        if create_order_log(order_data):
            return {"orderid": temp_orderid, "status": "Order Placed Successfully"}
        else:

            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order could not be placed")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order could not be placed")
    
@router.get("/admin/pending/",response_model=list[schemas.OrderView])
def getpendingorder(current_admin: schemas.Admin = Depends(oauth2.get_current_admin)):
    print(current_admin)
    adminid = current_admin["adminid"]
    data = get_pending_orders(adminid)
    data = list(data)
    orders = []
    for order in data:
        order_data = get_ordersbyid(order["orderid"])
        orders.append(order_data)
    return orders

@router.post("/admin/approve/", status_code=status.HTTP_201_CREATED)
def approvependingorder(current_admin: schemas.Admin = Depends(oauth2.get_current_admin), orderid: str = Form(None)):
    adminid = current_admin["adminid"]
    data = get_pending_orders(adminid)
    data = list(data)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Pending Orders")
    if orderid:
        for order in data:
            if order["orderid"] == orderid:
                if approve_order(orderid):
                    return {"orderid": orderid, "status": "Order Approved Successfully"}
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order could not be approved")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Orderid not provided")