import google.generativeai as genai
from .config import settings
from .text_recommend import recommend
from .database import get_product

# import config

API_KEY = settings.api_key

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-pro")
model.temperature = 0.4

preprompt = "You are a prompt helper for a fashion product recommendation system \
            You should return a reply if the user eneter prompts like hi hello or any other greetings \
            You should return a reply if the user asks for a recommendation for a fashion product by saying that providing recommendations for the product_name, dont generate any product details or other things, reply in single line\
            You should answer relevantly if the user aks for discounts or offers on the product by saying that Yes we provide discounts on product_name or similar relevant things but only in one line and no details\
            You should never answer questions like 'what is your name' or 'where are you from' or any other personal questions or anything other than fashion and return a funny relevant reply stating that you are a fashion recommender\
            You should reply with funny answers stating you are an fashion recommender if the user asks any questions related to any topic other than fashion or fashion products\
            You should return the response in plain text and not markdown or any other format\
            If the user does not give product suggest something from your end\
            The prompt user gave is : "


# preprompt = "You are assisting in developing a fashion product recommendation system that categorizes user inputs into 6 categories.         Aftercategorization, your task is to generate a key-value pair JSON response based on the identified categories and    their corresponding answers. Here are the categories and their expected responses:\
#     1. General Greeting: Identify user greetings and respond accordingly. Return a response containing the category number and a greeting reply.\
#     2. Discount Inquiry: Detect inquiries regarding discounts offered. Respond with the category number and an appropriate reply addressing the discount inquiry.\
#     3. Discounted Products Inquiry: Recognize user queries about specific products available at a discount. Provide responses containing the category number, discount information, and the product name specified by the user.\
#     4. Price Range Inquiry: Identify if the user is asking about products within a certain price range. Return responses with the category number, price information, and the specified product name.\
#     5. Product Inquiry: Recognize requests for information about specific products. Generate responses with the category number and the product name, including color and occasion if provided by the user.\
#     6. Irrelevant Query: Identify queries that are irrelevant or not understood. Respond with the category number and a suitable reply indicating that the query couldn't be understood.\
#     If the user does not give product suggest something from your end\
#     Do not mention that you are not a fashion recommender specialist as it is already assumed.\
#     You should reply with funny answers stating you are an fashion recommender if the user asks any questions related to any topic other than fashion or fashion product\
#     The prompt user gave is :"


def response(prompt):
    # response = model.generate_content(preprompt + prompt)
    # return response.text
    prod=[]

    dict = {
        "product_name": None,
        "discounts": None,
        "price_range": None,
        "is_discounts": None,
        "greetings": None,
        "color": None,
    }
    greetings = [
        "Hello",
        "Hi",
        "Hey",
        "Good morning",
        "Good afternoon",
        "Good evening",
        "Howdy",
        "Greetings",
        "Salutations",
        "What's up?",
        "How's it going?",
        "How are you?",
        "What's happening?",
        "Howdy-do",
        "What's new?",
        "Yo",
        "Sup?",
        "Hi there",
        "Good to see you",
        "What's going on?",
        "Howdy partner",
        "Top of the morning to you",
        "What's crackin'?",
        "How's tricks?",
        "How goes it?",
        "How's everything?",
        "How's life treating you?",
        "How are things?",
        "Lovely to see you",
        "It's a pleasure to meet you",
        "Welcome",
        "Good day",
        "Well met",
        "Nice to meet you",
        "How's your day?",
        "How are you doing today?",
        "Long time no see",
        "Hey there, stranger",
        "How's your week been?",
        "What's the good word?",
    ]
    colors = [
        "black",
        "blue",
        "brown",
        "green",
        "grey",
        "orange",
        "pink",
        "purple",
        "red",
        "silver",
        "white",
        "yellow",
    ]
    fashion_articles = [
        "T-shirts",
        "Jeans",
        "Dresses",
        "Suits",
        "Skirts",
        "Shorts",
        "Jackets",
        "Coats",
        "Sweaters",
        "Hoodies",
        "Blouses",
        "Shirts",
        "Trousers",
        "Leggings",
        "Blazers",
        "Jumpsuits",
        "Cardigans",
        "Vests",
        "Trench coats",
        "Ponchos",
        "Waistcoats",
        "Sarees",
        "Kurtas",
        "Lehengas",
        "Sherwanis",
        "Salwar Kameez",
        "Anarkali Suits",
        "Dupattas",
        "Gowns",
        "Crop tops",
        "Pants",
        "Swimwear",
        "Activewear",
        "Lingerie",
        "Sleepwear",
        "Socks",
        "Stockings",
        "Scarves",
        "Hats",
        "Gloves",
        "Belts",
        "Ties",
        "Bowties",
        "Handbags",
        "Backpacks",
        "Clutches",
        "Tote bags",
        "Shoulder bags",
        "Crossbody bags",
        "Wallets",
        "Purses",
        "Sunglasses",
        "Watches",
        "Bracelets",
        "Necklaces",
        "Earrings",
        "Rings",
        "Hair accessories",
        "Brooches",
        "Cufflinks",
        "Tie pins",
        "Pocket squares",
        "Umbrellas",
        "Footwear - Sneakers",
        "Footwear - Boots",
        "Footwear - Sandals",
        "Footwear - Heels",
        "Footwear - Flats",
        "Footwear - Loafers",
        "Footwear - Oxfords",
        "Footwear - Espadrilles",
        "Footwear - Wedges",
        "Footwear - Flip-flops",
        "Footwear - Mules",
        "Footwear - Slippers",
        "Footwear - Trainers",
    ]

    if "discount" in prompt or "discounts" in prompt:
        dict["is_discounts"] = True
        for i in prompt.split():
            if i in fashion_articles:
                dict["product_name"] = i
            if i.isdigit():
                dict["discounts"] = i
            if i in colors:
                dict["color"] = i
            if i in greetings:
                dict["greetings"] = i
    else:
        dict["is_discounts"] = False
        for i in prompt.split():
            if i in fashion_articles:
                dict["product_name"] = i
            if i in colors:
                dict["color"] = i
            if i.isdigit():
                dict["price_range"] = i
            if i in greetings:
                dict["greetings"] = i
    
    if dict["is_discounts"]:
        if dict["discounts"]:
            if dict["product_name"]:
                # search product
                products=recommend(dict["product_name"],20)
                products = list(products)
                products = list(map(int, products))
                for i in products:
                    product = get_product(i)
                    prod.append(product)
                return {"type": "product", "data": prod}
            else:
                response = "Please Provide Product Name along with discount for recommendations."
        else:
            response = model.generate_content(preprompt+prompt)
    else:
        if dict["product_name"]:
            if dict["price_range"]:
                # search product by price
                pass
            else:
                # search product by name
                pass
        else:
            if dict["greetings"]:
                response = model.generate_content(preprompt+prompt)
            else:
                response = model.generate_content(preprompt+prompt)
            
    # print(response.text)
    # return response.text

    # print(dict)
    # print(prod)
    # return "sample"
    return {"type": "text", "data": "sample"}