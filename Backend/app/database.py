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

# def update(userid,date,data):
#     a = list(read(userid))
#     flag = False
#     for i in a:
#         if i["userid"] == userid:
#             if i["date"] == date:
#                 flag = True
#                 db = connect()
#                 collection = db["chats"]
#                 collection.update_one({"userid": userid, "date": date}, {"$push": {"chats": data}})
#                 break

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
    