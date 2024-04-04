import json
import os

def insert(data):

    os.makedirs("data", exist_ok=True)

    json_string = json.dumps(data)

    with open("data/data.json", "w") as json_file:
        json_file.write(json_string)

    return True

def read(userid):
    if not os.path.exists("data/data.json"):
        return None

    with open("data/data.json", "r") as json_file:
        data = json.load(json_file)

    return data