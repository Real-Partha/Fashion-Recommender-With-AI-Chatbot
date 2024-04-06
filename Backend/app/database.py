import pymongo

def connect():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["chats"]
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
