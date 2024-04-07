from pydantic_settings import BaseSettings


class Setting(BaseSettings):
    api_key: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    class Config:
        env_file = ".env"


settings = Setting()
