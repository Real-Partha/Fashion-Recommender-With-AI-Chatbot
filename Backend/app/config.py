from pydantic_settings import BaseSettings


class Setting(BaseSettings):
    api_key: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    products_url: str
    index_file_url: str
    ids_file_url: str
    dictionary_url: str
    fashion_path_url: str
    color_path_url: str
    greeting_path_url: str
    saved_model_path: str
    database_url: str
    gender_path_url: str

    class Config:
        env_file = ".env"


settings = Setting()
