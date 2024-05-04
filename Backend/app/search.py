from .config import settings
from .text_recommend import recommend
from .database import get_product
from spellchecker import SpellChecker

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

def search_txt(prompt1):
    correction_file = settings.correction_path_url
    # correction_file = '/Users/mdehteshamansari00/Fashion-Recommender-With-AI-Chatbot/Backend/app/Data/fashion_dictionary.txt'  # File containing corrections (icorrect_word : correct_word)
    spell = SpellChecker()
    correction_dict = load_correction_dictionary(correction_file)
    prompt = correct_spelling(prompt1, correction_dict, spell)
    print(prompt)
    dict = {
        "product_name": None,
        "discounts": None,
        "price_range": None,
        "is_discounts": None,
        "color": None,
    }
    fashion_path = settings.fashion_path_url
    color_path = settings.color_path_url
    gender_path = settings.gender_path_url
    with open(fashion_path, "r") as f:
        fashion_articles = f.read().split("\n")
    with open(color_path, "r") as f:
        colors = f.read().split("\n")
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
            if i in gender:
                dict["gender"] = i
    
    if dict["is_discounts"]:
        if dict["discounts"]:
            if dict["product_name"]:
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
            response = "Please Provide Discount for recommendations."
            return {"type": "text", "data": response.text}
    else:
        if dict["product_name"]:
            if dict["price_range"]:
                if dict['color']:
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
            return {"type": "text", "data": "Please Provide Product Name for recommendations."}