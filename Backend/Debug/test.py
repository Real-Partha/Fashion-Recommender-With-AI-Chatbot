import pymongo

def connect():
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["chats"]
    return db

def insert_mongo(data):
    db = connect()
    collection = db["chats"]
    collection.insert_one(data)
    return True

def read_mongo(userid):
    db = connect()
    collection = db["chats"]
    data = collection.find({"userid": userid})
    # l = list(data)
    # print(len(l))
    # print(data.count_documents({}))
    return data

data = [
      { "00:21": "Salam Alaikum" },
      { "00:21": "As-salamu alaykum. I am a fashion recommender." },
      { "00:24": "Red shoe" },
      { "00:24": "Providing recommendations for Red shoe only" },
      { "00:24": "Shhoes" },
      { "00:24": "Providing recommendations for 'Shoes' only" },
      { "00:24": "Hieeeee" },
      {
        "00:24": "Hi there! I'm a fashion product recommendation system, not a personal assistant. I can help you find the perfect outfit, but I can't answer questions about myself."
      },
      { "00:24": "Hie" },
      {
        "00:24": "Hi! I'm here to help you with fashion product recommendations."
      },
      { "00:48": "haa meri jaan" },
      { "00:48": "I am a fashion recommender" },
      { "00:49": "suggest me bracelett" },
      { "00:49": "Providing recommendations for bracelets only" },
      { "02:16": "mujhe juta dikhao" },
      { "02:16": "Sure, let me help you find your perfect pair of shoes!" },
      { "02:17": "mujhe laal chasma chahiye" },
      { "02:17": "Providing recommendations for Red Sunglasses" },
      { "02:22": "beta tum kaun ho?" },
      { "02:22": "Sorry, I'm just a fashion product recommendation system." },
      { "12:29": "are you good?" },
      {
        "12:29": "I am a fashion recommender, designed to help you find the perfect fashion item."
      }
    ]

# insert_mongo({"userid": "test", "date": "06-06-2021", "chats":data})
a = read_mongo("test")
a = list(a)
flag = False
for i in a:
    if i["userid"] == "test":
        if i["date"] == "04-07-2024":
            flag = True
            db = connect()
            collection = db["chats"]
            collection.update_one({"userid": "test", "date": "04-07-2024"}, {"$push": {"chats": {"00:41": "Hello From Sample"}}})
            break
if not flag:
    insert_mongo({"userid": "test", "date": "04-07-2024", "chats":[{"00:40": "Hello From New Sample"}]})