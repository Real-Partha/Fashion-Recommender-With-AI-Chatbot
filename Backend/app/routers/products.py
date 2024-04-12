from fastapi import APIRouter,HTTPException,status
from ..database import get_product
from .. import schemas

router = APIRouter(
    prefix="/product", tags=["product"]
)

@router.get("/{product_id}/",status_code=status.HTTP_200_OK,response_model=schemas.Product)
def getproduct(product_id:int):
    try:
        data = get_product(product_id)

        # print(data)
        if data:
            return dict(data)
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Product not found")
    except Exception as e:
        print(f"Error fetching product: {e}")