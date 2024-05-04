import pandas as pd
from pymongo import MongoClient
import certifi

# Connect to MongoDB
client = MongoClient("localhost", 27017)
db = client['fashion']
collection = db['products']

# Read CSV file into pandas DataFrame
df = pd.read_csv("D:\\SRM AP All Documents\\College Files\\Semester - VI\\Software Engineering\\Fashion Recommender Final\\Backend\\app\\Data\\products_datafinal_save.csv")

# Define a function to push each row to MongoDB
def push_to_mongodb(row):
    product = {
        'pid': row['id'],
        'name': row['productDisplayName'],
        'price': row['price'],
        'ofprice': row['ogprice'],
        'discount': row['discount'],
        'imglink': row['link']
    }
    collection.insert_one(product)

# Iterate over each row in the DataFrame and push to MongoDB
for index, row in df.iterrows():
    if index%1000 == 0:
        print(f"Pushed {index} rows to MongoDB.")
    push_to_mongodb(row)

print("Data successfully pushed to MongoDB.")