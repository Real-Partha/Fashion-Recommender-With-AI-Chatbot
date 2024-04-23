import os
from fastapi import APIRouter, HTTPException, UploadFile, status, Depends, Form
from ..database import get_product, get_random_products, add_product, get_last_product
from .. import schemas
from .. import oauth2

router = APIRouter(prefix="/product", tags=["product"])


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
    discount: int = Form(None),
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
            return data
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
