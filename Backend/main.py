from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/search/{id}/")
def search(id: int):
    if id==9922:
        return {"id": "Ehetsham"}
    else:
        return {"id": "Lakshya"}