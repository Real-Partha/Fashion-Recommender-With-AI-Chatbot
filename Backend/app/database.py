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

# p=[{
#   "pid": 60001,
#   "name": "SPARKLIZA Men Black Genuine Leather Belt",
#   "price": 237,
#   "ofprice": 2300,
#   "discount": 89,
#   "imglink": "https://rukminim2.flixcart.com/image/612/612/xif0q/belt/r/f/7/34-oplera-men-s-genuine-leather-finish-belt-for-men-boys-pack-of-original-imaguzt6hffhudpk.jpeg?q=70"
# },
# {
#   "pid": 60002,
#   "name": "SPARKLIZA Men Formal Black Genuine Leather Belt",
#   "price": 237,
#   "ofprice": 1450,
#   "discount": 83,
#   "imglink": "https://rukminim2.flixcart.com/image/612/612/xif0q/belt/r/f/7/34-oplera-men-s-genuine-leather-finish-belt-for-men-boys-pack-of-original-imaguzt6hffhudpk.jpeg?q=70"
# },
# {
#   "pid": 60003,
#   "name": "METRONAUT Men Casual Black Artificial Leather Belt",
#   "price": 149,
#   "ofprice": 1199,
#   "discount": 87,
#   "imglink": "https://rukminim2.flixcart.com/image/612/612/xif0q/belt/c/n/m/28-mdl-bob-131-bl-sty-bob-131-bl-belt-sunshopping-original-imagqujbxqhtdqc8.jpeg?q=70"
# },
# {
#   "pid": 60004,
#   "name": "Roadster Men Formal, Casual, Party Black Artificial Leather, Texas Leatherite Belt",
#   "price": 179,
#   "ofprice": 1499,
#   "discount": 88,
#   "imglink": "https://rukminim2.flixcart.com/image/612/612/xif0q/belt/r/a/a/38-vegan-leather-belt-rdr-rab-51-38-belts-for-men-roadster-original-imagm6txvs4t8tma.jpeg?q=70"
# },
# {
#   "pid": 60005,
#   "name": "ZORO Men Evening, Party, Formal, Casual Black Artificial Leather, Texas Leatherite Belt",
#   "price": 299,
#   "ofprice": 1499,
#   "discount": 80,
#   "imglink": "https://rukminim2.flixcart.com/image/612/612/xif0q/belt/p/n/p/one-size-cr21-cr21-belt-zoro-original-imaghqf2dceh6pgz.jpeg?q=70"
# },
# {
#   "pid": 60000,
#   "name": "Alma Women Blue Kurta",
#   "price": 1517,
#   "ofprice": 2199,
#   "discount": 31,
#   "imglink": "http://assets.myntassets.com/v1/images/style/properties/Alma-Women-Blue-Kurta_c5508a0aa7893889c7db92c7c46ae461_images.jpg"
# }] 
# data = {"time":"15:54","type":"product","message":"","role":"chatbot","prodcuts":p}
# update(20240407000,"10-04-2024",data)
    