import pandas as pd
import numpy as np
import tensorflow_hub as hub
import faiss
import time
import os

# Load your dataset
# df = pd.read_csv("test.csv")
products = pd.read_csv('test.csv', on_bad_lines="skip")
new_product = products[['id', 'productDisplayName']]
url=pd.read_csv('test.csv', on_bad_lines="skip")
final=pd.read_csv('test.csv', on_bad_lines="skip")
# Load pre-trained Universal Sentence Encoder
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

# Check if FAISS index file exists
index_file = "faiss_index.index"
ids_file = "faiss_index_ids.npy"

if os.path.exists(index_file):
    # Load FAISS index
    index = faiss.read_index(index_file)
    # Load the corresponding IDs mapping if exists
    if os.path.exists(ids_file):
        faiss_index_ids = np.load(ids_file)
    else:
        # Extract IDs from new_product
        faiss_index_ids = np.array(new_product['id'])
        # Save the IDs mapping
        np.save(ids_file, faiss_index_ids)
else:
    # Precompute embeddings for all product names
    product_embeddings = embed(new_product['productDisplayName'])

    # Convert embeddings to numpy array
    product_embeddings = np.array(product_embeddings)

    # Convert to float32 (required by FAISS)
    product_embeddings = product_embeddings.astype('float32')

    # Build FAISS index
    index = faiss.IndexFlatIP(product_embeddings.shape[1])
    index.add(product_embeddings)

    # Extract IDs from new_product
    faiss_index_ids = np.array(new_product['id'])
    # Save the IDs mapping
    np.save(ids_file, faiss_index_ids)
    # Save FAISS index
    faiss.write_index(index, index_file)

# User query
user_query = "men black sun glass"

# Encode user query
query_embedding = embed([user_query])[0].numpy()

# Convert to float32 (required by FAISS)
query_embedding = query_embedding.astype('float32')

# Search for similar products
start_time = time.time()
k = 10  # Number of nearest neighbors to retrieve
distances, indices = index.search(np.expand_dims(query_embedding, axis=0), k)
end_time = time.time()

# Extract the IDs of the most similar products
similar_product_ids = faiss_index_ids[indices[0]]
print(similar_product_ids)
# # Print top k most similar products
# for i, product_id in enumerate(similar_product_ids):
#     print(f"{i+1}. Product ID: {product_id}")

# print(f"Search time: {end_time - start_time} seconds")
# lst1=[]
# for i in similar_product_ids:
#     lst=[]
#     lst.append(i)
#     lst.append(products[products['id']==i]['productDisplayName'].values[0])
#     lst.append(url[url['filename']==str(i).strip()+'.jpg']['link'].values[0])
#     lst.append(int(products[products['id']==i]['price'].values[0]))
#     lst.append(int(products[products['id']==i]['ogprice'].values[0]))
#     lst.append(int(products[products['id']==i]['discount'].values[0]))
#     lst1.append(lst)
# print("\n".join(str(x) for x in lst1))