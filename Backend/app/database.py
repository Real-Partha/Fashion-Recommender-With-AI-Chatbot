import random
import pymongo

def connect():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["fashion"]
    return db

def read(userid):
    db = connect()
    collection = db["chats"]
    data = collection.find({"userid": userid})
    return data

def insert(data):
    db = connect()
    collection = db["chats"]
    collection.insert_one(data)
    return True

def update(userid, date, data):
    try:
        db = connect()
        collection = db["chats"]
        collection.update_one(
            {"userid": userid, "date": date},
            {"$push": {"chats": data}}
        )
        return True
    except Exception as e:
        print(f"Error updating document: {e}")
        return False

def get_userbyid(userid):
    db = connect()
    collection = db["users"]
    data = collection.find_one({"userid": userid}, {"_id": 0,"password": 0})
    return data

def get_userbycondition(condition):
    db = connect()
    collection = db["users"]
    data = collection.find_one(condition, {"_id": 0,"password": 0})
    return data

def create_user(data):
    try:
        db = connect()
        collection = db["users"]
        collection.insert_one(data)
        return True
    except:
        return False
    
def create_admin(data):
    try:
        db = connect()
        collection = db["admins"]
        collection.insert_one(data)
        return True
    except:
        return False
    
def get_adminbyid(adminid):
    db = connect()
    collection = db["admins"]
    data = collection.find_one({"adminid": adminid}, {"_id": 0,"password": 0})
    return data

def get_adminbycondition(condition):
    db = connect()
    collection = db["admins"]
    data = collection.find_one(condition, {"_id": 0,"password": 0})
    return data
    
def token_entry(token,status):
    db = connect()
    collection = db["tokens"]
    if status == "active":
        collection.insert_one({"token": token, "status": status})
    elif status == "expired":
        collection.update_one({"token": token}, {"$set": {"status": status}})

def verify_token(token):
    db = connect()
    collection = db["tokens"]
    data = collection.find_one({"token": token})
    if data["status"] == "active":
        return True
    else:
        return False

def add_product(data):
    db = connect()
    collection = db["products"]
    collection.insert_one(data)
    return True

def get_last_product():
    db = connect()
    collection = db["products"]
    last_product = collection.find({},{"_id":0}).sort("pid", pymongo.DESCENDING).limit(1)
    last_product = list(last_product)
    return last_product[0] if len(last_product) > 0 else None

def get_product(product_id):
    db = connect()
    collection = db["products"]
    data = collection.find_one({"pid": product_id},{"_id":0})
    return data

def add_product_owner(product_id, admin_id):
    db = connect()
    collection = db["products_owners"]
    collection.insert_one({"pid": product_id, "adminid": admin_id, "status": "active"})
    return True

def get_owner_products(adminid):
    db = connect()
    collection = db["products_owners"]
    data = collection.find({"adminid": adminid},{"_id":0})
    return data

def get_product_owner(product_id):
    db = connect()
    collection = db["products_owners"]
    data = collection.find_one({"pid": product_id},{"_id":0})
    return data

def delete_product_owner(product_id):
    db = connect()
    collection = db["products_owners"]
    collection.delete_one({"pid": product_id})
    return True

def delete_product(product_id):
    db = connect()
    collection = db["products"]
    collection.delete_one({"pid": product_id})
    return True

def get_random_products(number):
    db = connect()
    collection = db["products"]
    data = collection.find({},{"_id":0})
    data = list(data)
    random_indexes = random.sample(range(len(data)), number)
    random_products = [data[i] for i in random_indexes]
    return random_products

def get_orders_user(userid):
    db = connect()
    collection = db["orders"]
    data = collection.find({"userid": userid},{"_id":0})
    return data

def get_ordersbyid(orderid):
    db = connect()
    collection = db["orders"]
    data = collection.find_one({"orderid": orderid},{"_id":0})
    return data

def create_order(data):
    db = connect()
    collection = db["orders"]
    collection.insert_one(data)
    return True

def create_order_log(data):
    db = connect()
    collection = db["orders_log"]
    collection.insert_one(data)
    return True

def get_pending_orders(adminid):
    db = connect()
    collection = db["orders_log"]
    data = collection.find({"adminid": adminid, "status": "placed"},{"_id":0})
    return data

def approve_order(orderid):
    db = connect()
    collection = db["orders_log"]
    collection.update_one({"orderid": orderid}, {"$set": {"status": "approved"}})
    collection = db["orders"]
    collection.update_one({"orderid": orderid}, {"$set": {"status": "approved"}})
    return True