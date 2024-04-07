import pymongo

def rename_database(old_name, new_name):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    # Access the old and new databases
    old_db = client[old_name]
    new_db = client[new_name]

    # Copy collections from old database to new database
    for collection_name in old_db.list_collection_names():
        collection = old_db[collection_name]
        new_collection = new_db[collection_name]
        try:
            new_collection.insert_many(collection.find())
        except:
            continue
    # Drop the old database
    # client.drop_database(old_name)
    print(f"Database '{old_name}' renamed to '{new_name}'")

# Rename the database
rename_database("chats", "fashion")
