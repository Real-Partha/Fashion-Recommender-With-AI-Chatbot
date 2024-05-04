import os
from time import sleep
from fastapi import APIRouter, HTTPException, UploadFile, status, Depends, Form
from ..database import get_product, get_random_products, add_product, get_last_product, add_product_owner, get_owner_products,delete_product,delete_product_owner,get_product_owner
from .. import schemas
from .. import oauth2

router = APIRouter(prefix="/product", tags=["product"])


@router.get("/sanket/")
def getsanket(current_user: schemas.Admin = Depends(oauth2.get_current_admin)):
    if current_user:
        return {"message": "Sanket is here"}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="You are not authorized"
        )

@router.get(
    "/{product_id}/", status_code=status.HTTP_200_OK, response_model=schemas.Product
)
def getproduct(product_id: int):
    try:
        data = get_product(product_id)

        # print(data)
        if data:
            return dict(data)
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

@router.post("/random/more/{number}/",status_code=status.HTTP_200_OK,response_model=list[schemas.Product])
def getmorerandomproducts(number: int,productListState: list = Form(None)):
# def getmorerandomproducts(number: int,productListState: list[schemas.Product] = Form(None)):
    if number == 0:
        return []

    try:
        # new_products = []
        # while len(new_products) < number:
        #     data = get_random_products(number-len(new_products))
        #     for i in data:
        #         if i not in productListState:
        #             new_products.append(i)
        # return list(productListState)+new_products
        print(productListState)
        data = get_random_products(number)
        if data:
            return data
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Products could not be fetched",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Products could not be fetched",
        )

@router.get(
    "/random/{number}",
    status_code=status.HTTP_200_OK,
    response_model=list[schemas.Product],
)
def getrandomproducts(number: int):

    if number == 0:
        return []

    try:
        data = get_random_products(number)
        if data:
            sleep(2)
            return data[:number]
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Products could not be fetched",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Products could not be fetched",
        )

@router.post("/add/", status_code=status.HTTP_201_CREATED, response_model=schemas.Product)
def addproduct(
    name: str = Form(None),
    price: float = Form(None),
    ogPrice: float = Form(None),
    discount: float = Form(None),
    image: UploadFile = Form(None),
    current_user: schemas.Admin = Depends(oauth2.get_current_admin),
):
    try:
        data = {}
        data["name"] = name
        data["price"] = price
        data["ofprice"] = ogPrice
        data["discount"] = discount
        
        os.makedirs("../Frontend/public/productimages", exist_ok=True)
        
        last_product = get_last_product()
        new_pid = 0
        if last_product is not None:
            new_pid = last_product["pid"] + 1
        else:
            new_pid = 1
        file = f"{new_pid}.jpg"
        with open(f"../Frontend/public/productimages/{file}", "wb") as f:
            f.write(image.file.read())
        print(new_pid)
        data["pid"] = new_pid
        data["imglink"] = f"/productimages/{file}"
        result = add_product(data)
        if result:
            add_result = add_product_owner(new_pid, current_user["adminid"])
            if add_result:
                return data
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="Product could not be added"
                )
        else:
            print("Inside Else")
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Product could not be added"
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Product could not be added"
        )

@router.get("/admin/show/", status_code=status.HTTP_200_OK, response_model=list[schemas.Product])
def getproductbyadmin(get_current_admin: schemas.Admin = Depends(oauth2.get_current_admin)):
    try:
        data = get_owner_products(get_current_admin["adminid"])
        data = list(data)
        if len(data) == 0:
            return []
        result = []
        for i in data:
            product = get_product(i["pid"])
            result.append(product)

        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    
@router.delete("/delete/{product_id}/", status_code=status.HTTP_200_OK)
def deleteproduct(product_id: int, get_current_admin: schemas.Admin = Depends(oauth2.get_current_admin)):
    try:
        data = get_product_owner(product_id)
        if data:
            if data["adminid"] == get_current_admin["adminid"]:
                result1 = delete_product(product_id)
                result2 = delete_product_owner(product_id)
                if result1 and result2:
                    return {"detail": "Product deleted successfully"}
                else:
                    print("Here 1")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST, detail="Product could not be deleted"
                    )
            else:
                print("Here 2")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="You are not the owner of this product"
                )
        else:
            print("Here 3")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    
