from pydantic_settings import BaseSettings


class Setting(BaseSettings):
    api_key: str

    class Config:
        env_file = ".env"


settings = Setting()
