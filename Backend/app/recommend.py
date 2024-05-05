from time import sleep
import google.generativeai as genai
from .config import settings
from .text_recommend import recommend
from .database import get_product
from spellchecker import SpellChecker

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
            Donot answer to any encoded text and strictly refrain from encoded text or anything misleading if relating them to fashion\
            If the user does not give product suggest something from your end\
            The prompt user gave is : "


def load_correction_dictionary(file_path):
    correction_dict = {}
    with open(file_path, 'r') as file:
        for line in file:
            incorrect, correct = line.strip().split(':')
            correction_dict[incorrect.strip()] = correct.strip()
    return correction_dict

def correct_spelling(prompt, correction_dict, spell_checker):
    corrected_prompt = []
    for word in prompt.split():
        if word.lower() in correction_dict:
            print(f"Correcting '{word}' to '{correction_dict[word.lower()]}'")
            corrected_prompt.append(correction_dict[word.lower()])
        else:
            corrected_word = spell_checker.correction(word)
            corrected_prompt.append(corrected_word)
    return ' '.join(corrected_prompt)




def response(prompt1):
    # correction_file = 'D:\\SE\\Fashion-Recommender-With-AI-Chatbot\Backend\\app\Data\\fashion_dictionary.txt'  # File containing corrections (icorrect_word : correct_word)
    correction_file = settings.correction_path_url
    spell = SpellChecker()
    correction_dict = load_correction_dictionary(correction_file)
    prompt = correct_spelling(prompt1, correction_dict, spell)
    prompt = prompt.lower()
    print(prompt)
    dict = {
        "product_name": None,
        "discounts": None,
        "price_range": None,
        "is_discounts": None,
        "greetings": None,
        "color": None,
        "gender": None,
    }
    fashion_path = settings.fashion_path_url
    color_path = settings.color_path_url
    greeting_path = settings.greeting_path_url
    gender_path = settings.gender_path_url
    with open(fashion_path, "r") as f:
        fashion_articles = f.read().split("\n")
    with open(color_path, "r") as f:
        colors = f.read().split("\n")
    with open(greeting_path, "r") as f:
        greetings = f.read().split("\n")
    with open(gender_path, "r") as f:
        gender = f.read().split("\n")
    if "discount" in prompt or "discounts" in prompt:
        dict["is_discounts"] = True
        for i in prompt.split():
            if i in fashion_articles:
                if dict["product_name"] == None:
                    dict["product_name"] = i
                else:
                    dict["product_name"] += " "+i
            if i.isdigit():
                dict["discounts"] = i
            if i in colors:
                if dict["color"] == None:
                    dict["color"] = i
                else:
                    dict["color"] += " "+i
            if i in greetings:
                if dict["greetings"] == None:
                    dict["greetings"] = i
                else:
                    dict["greetings"] += " "+i
            if i in gender:
                dict["gender"] = i
    else:
        dict["is_discounts"] = False
        for i in prompt.split():
            if i in fashion_articles:
                if dict["product_name"] == None:
                    dict["product_name"] = i
                else:
                    dict["product_name"] += " "+i
            if i in colors:
                if dict["color"] == None:
                    dict["color"] = i
                else:
                    dict["color"] += " "+i
            if i.isdigit():
                dict["price_range"] = i
            if i in greetings:
                if dict["greetings"] == None:
                    dict["greetings"] = i
                else:
                    dict["greetings"] += " "+i
            if i in gender:
                dict["gender"] = i
    
    if dict["is_discounts"]:
        if dict["discounts"]:
            if dict["product_name"]:
                if dict["color"]:
                    if dict['greetings']:
                        if dict["gender"]:
                            print(dict)
                            products=recommend(dict["gender"]+" "+dict["color"]+" "+dict["product_name"],30)
                            products = list(products)
                            products = list(map(int, products))
                            prod=[]
                            for i in products:
                                product = get_product(i)
                                prod.append(product)
                            final = []
                            for i in prod:
                                if i["discount"] >= int(dict["discounts"]):
                                    final.append(i)
                            product_name = dict["product_name"]
                            if len(final) == 0:
                                response = f"Sorry, there no {product_name} with that discount."
                                return {"type": "text", "data": response}
                            return {"type": "product", "data": final}
                        print(dict)
                        products=recommend(dict["color"]+" "+dict["product_name"],30)
                        products = list(products)
                        products = list(map(int, products))
                        prod=[]
                        for i in products:
                            product = get_product(i)
                            prod.append(product)
                        final = []
                        for i in prod:
                            if i["discount"] >= int(dict["discounts"]):
                                final.append(i)
                        product_name = dict["product_name"]
                        if len(final) == 0:
                            response = f"Sorry, there no {product_name} with that discount."
                            return {"type": "text", "data": response}
                        return {"type": "product", "data": final}
                    if dict["gender"]:
                        print(dict)
                        products=recommend(dict["gender"]+" "+dict["color"]+" "+dict["product_name"],30)
                        products = list(products)
                        products = list(map(int, products))
                        prod=[]
                        for i in products:
                            product = get_product(i)
                            prod.append(product)
                        final = []
                        for i in prod:
                            if i["discount"] >= int(dict["discounts"]):
                                final.append(i)
                        product_name = dict["product_name"]
                        if len(final) == 0:
                            response = f"Sorry, there no {product_name} with that discount."
                            return {"type": "text", "data": response}
                        return {"type": "product", "data": final}
                    print(dict)
                    products=recommend(dict["color"]+" "+dict["product_name"],30)
                    products = list(products)
                    products = list(map(int, products))
                    prod=[]
                    for i in products:
                        product = get_product(i)
                        prod.append(product)
                    final = []
                    for i in prod:
                        if i["discount"] >= int(dict["discounts"]):
                            final.append(i)
                    product_name = dict["product_name"]
                    if len(final) == 0:
                        response = f"Sorry, there no {product_name} with that discount."
                        return {"type": "text", "data": response}
                    return {"type": "product", "data": final}
                # search product
                if dict["gender"]:
                    print(dict)
                    products=recommend(dict["gender"]+" "+dict["product_name"],30)
                    products = list(products)
                    products = list(map(int, products))
                    prod=[]
                    for i in products:
                        product = get_product(i)
                        prod.append(product)
                    final = []
                    for i in prod:
                        if i["discount"] >= int(dict["discounts"]):
                            final.append(i)
                    product_name = dict["product_name"]
                    if len(final) == 0:
                        response = f"Sorry, there no {product_name} with that discount."
                        return {"type": "text", "data": response}
                    return {"type": "product", "data": final}
                print(dict)
                products=recommend(dict["product_name"],30)
                products = list(products)
                products = list(map(int, products))
                prod=[]
                for i in products:
                    product = get_product(i)
                    prod.append(product)
                final = []
                for i in prod:
                    if i["discount"] >= int(dict["discounts"]):
                        final.append(i)

                product_name = dict["product_name"]
                if len(final) == 0:
                    response = f"Sorry, there no {product_name} with that discount."
                    return {"type": "text", "data": response}

                return {"type": "product", "data": final}
            else:
                response = "Please Provide Product Name along with discount for recommendations."
                # sleep(20)
                return {"type": "text", "data": response}

        else:
            response = model.generate_content(preprompt+prompt)
            return {"type": "text", "data": response.text}
    else:
        if dict["product_name"]:
            if dict["price_range"]:
                if dict['color']:
                    if dict['greetings']:
                        if dict["gender"]:
                            print(dict)
                            products=recommend(dict["gender"]+" "+dict["color"]+" "+dict["product_name"],30)
                            products = list(products)
                            products = list(map(int, products))
                            prod=[]
                            for i in products:
                                product = get_product(i)
                                prod.append(product)
                            final = []
                            for i in prod:
                                if i["price"] <= int(dict["price_range"]):
                                    final.append(i)
                            product_name = dict["product_name"]
                            if len(final) == 0:
                                response = f"Sorry, there no {product_name} within that price range."
                                return {"type": "text", "data": response}
                            return {"type": "product", "data": final}
                        print(dict)
                        products=recommend(dict["color"]+" "+dict["product_name"],30)
                        products = list(products)
                        products = list(map(int, products))
                        prod=[]
                        for i in products:
                            product = get_product(i)
                            prod.append(product)
                        final = []
                        for i in prod:
                            if i["price"] <= int(dict["price_range"]):
                                final.append(i)
                        product_name = dict["product_name"]
                        if len(final) == 0:
                            response = f"Sorry, there no {product_name} within that price range."
                            return {"type": "text", "data": response}
                        return {"type": "product", "data": final}
                    
                    if dict["gender"]:
                        print(dict)
                        products=recommend(dict["gender"]+" "+dict["product_name"],30)
                        products = list(products)
                        products = list(map(int, products))
                        prod=[]
                        for i in products:
                            product = get_product(i)
                            prod.append(product)
                        final = []
                        for i in prod:
                            if i["price"] <= int(dict["price_range"]):
                                final.append(i)
                        product_name = dict["product_name"]
                        if len(final) == 0:
                            response = f"Sorry, there no {product_name} within that price range."
                            return {"type": "text", "data": response}
                        return {"type": "product", "data": final}
                    print(dict)
                    products=recommend(dict["color"]+" "+dict["product_name"],30)
                    products = list(products)
                    products = list(map(int, products))
                    prod=[]
                    for i in products:
                        product = get_product(i)
                        prod.append(product)
                    final = []
                    for i in prod:
                        if i["price"] <= int(dict["price_range"]):
                            final.append(i)
                    product_name = dict["product_name"]
                    if len(final) == 0:
                        response = f"Sorry, there no {product_name} within that price range."
                        return {"type": "text", "data": response}
                    return {"type": "product", "data": final}
                if dict["gender"]:
                    products=recommend(dict["gender"]+" "+dict["product_name"],30)
                    products = list(products)
                    products = list(map(int, products))
                    prod=[]
                    for i in products:
                        product = get_product(i)
                        prod.append(product)
                    final = []
                    for i in prod:
                        if i["price"] <= int(dict["price_range"]):
                            final.append(i)
                    product_name = dict["product_name"]
                    if len(final) == 0:
                        response = f"Sorry, there no {product_name} within that price range."
                        return {"type": "text", "data": response}
                    
                    return {"type": "product", "data": final}
                products=recommend(dict["product_name"],30)
                products = list(products)
                products = list(map(int, products))
                prod=[]
                for i in products:
                    product = get_product(i)
                    prod.append(product)
                final = []
                for i in prod:
                    if i["price"] <= int(dict["price_range"]):
                        final.append(i)
                product_name = dict["product_name"]
                if len(final) == 0:
                    response = f"Sorry, there no {product_name} within that price range."
                    return {"type": "text", "data": response}
                
                return {"type": "product", "data": final}
            if dict["color"]:
                if dict["gender"]:
                    print(dict)
                    products=recommend(dict["gender"]+" "+dict["color"]+" "+dict["product_name"],30)
                    products = list(products)
                    products = list(map(int, products))
                    prod=[]
                    for i in products:
                        product = get_product(i)
                        prod.append(product)
                    return {"type": "product", "data": prod}
                print(dict)
                products=recommend(dict["color"]+" "+dict["product_name"],30)
                products = list(products)
                products = list(map(int, products))
                prod=[]
                for i in products:
                    product = get_product(i)
                    prod.append(product)
                return {"type": "product", "data": prod}
            if dict["gender"]:
                print(dict)
                products=recommend(dict["gender"]+" "+dict["product_name"],30)
                products = list(products)
                products = list(map(int, products))
                prod=[]
                for i in products:
                    product = get_product(i)
                    prod.append(product)
                return {"type": "product", "data": prod}
            print(dict)
            products=recommend(dict["product_name"],30)
            products = list(products)
            products = list(map(int, products))
            prod=[]
            for i in products:
                product = get_product(i)
                prod.append(product)
            return {"type": "product", "data": prod}
        else:
            if dict["greetings"]:
                response = model.generate_content(preprompt+prompt)
                return {"type": "text", "data": response.text}
            else:
                response = model.generate_content(preprompt+prompt)
                return {"type": "text", "data": response.text}