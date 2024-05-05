import numpy as np
from numpy.linalg import norm
import tensorflow
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from sklearn.neighbors import NearestNeighbors
import matplotlib.pyplot as plt
from .config import settings
from .database import get_product

# Load pre-computed embeddings and filenames
feature_list = np.load(settings.embeddings_path_url)

with open(settings.filenames_path_url, 'r') as file:
    filenames = [filename.replace("\\", "/") for filename in file.read().splitlines()]
def get_image(query_image_path,feature_list=feature_list):
    print(filenames[:5])
    # Load pre-trained ResNet50 model for feature extraction
    base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False

    # Create a new model with GlobalMaxPooling2D layer for feature extraction
    model = tensorflow.keras.Sequential([
        base_model,
        GlobalMaxPooling2D()
    ])
    # Load an image for query
    # query_image_path = 'test3.png'
    query_img = image.load_img(query_image_path, target_size=(224, 224))
    query_img_array = image.img_to_array(query_img)
    query_img_array = np.expand_dims(query_img_array, axis=0)
    query_img_processed = preprocess_input(query_img_array)

    # Extract features from the query image using the model
    query_features = model.predict(query_img_processed).flatten()
    normalized_query_features = query_features / norm(query_features)
    # Define the Nearest Neighbors model
    neighbors = NearestNeighbors(n_neighbors=31, algorithm='brute', metric='euclidean')
    neighbors.fit(feature_list)

    # Find nearest neighbors based on the query features
    distances, indices = neighbors.kneighbors([normalized_query_features])
    # give the indices of the 5 nearest neighbors
    # return indices[0]
    lst = []
    for i,idx in enumerate(indices[0][1:31]):
        lst.append(filenames[idx].split("/")[-1].replace(".jpg", ""))

    print(lst)
    products = []
    for i in lst:
        product = get_product(int(i))
        if product:
            products.append(product)
    if products != []:
        return {"type": "product", "data": products}
    return {"type": "text", "data": "Currently Recommendation using only image is in progress...Please Try Again Later..."}