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

def update(userid,date,data):
    a = list(read(userid))
    a = list(a)
    flag = False
    for i in a:
        if i["userid"] == userid:
            if i["date"] == date:
                flag = True
                db = connect()
                collection = db["chats"]
                collection.update_one({"userid": userid, "date": date}, {"$push": {"chats": data}})
                break

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
    
def login_user(credentials,password):
    db = connect()
    collection = db["users"]
    data = collection.find_one({"email":credentials},{"_id":0,"email":1,"userid":1,"password":1})
    if data:
        if data["password"] == password:
            return data
        else:
            return False
    else:
        return False
    

    