import pandas as pd
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://parthapratimpaul2003:qxwdSH5OU95IWB8r@fashion-ecommerce.6funcp3.mongodb.net/?retryWrites=true&w=majority&appName=Fashion-Ecommerce")
db = client['Fashion']
collection = db['products']

# Read CSV file into pandas DataFrame
df = pd.read_csv('Backend\\Recommend\\Text\\Data\\test.csv')

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
    push_to_mongodb(row)

print("Data successfully pushed to MongoDB.")