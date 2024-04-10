from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('localhost', 27017)
db = client['fashion']  # Replace 'your_database' with your actual database name
collection_old = db['chats']
collection_new = db['chats_new']

# Function to transform chats field
def transform_chats(chats):
    new_chats = []
    role = 'user'
    for chat in chats:
        time = list(chat.keys())[0]
        message = list(chat.values())[0]
        new_chat = {
            "time": time,
            "type": "text",
            "message": message,
            "role": role
        }
        new_chats.append(new_chat)
        role = 'chatbot' if role == 'user' else 'user'
    return new_chats

# Iterate over documents in old collection, transform chats, and insert into new collection
for document in collection_old.find():
    userid = document['userid']
    date = document['date']
    chats = transform_chats(document['chats'])
    new_document = {
        "userid": userid,
        "date": date,
        "chats": chats
    }
    collection_new.insert_one(new_document)

print("Data successfully transformed and inserted into chats_new collection.")
