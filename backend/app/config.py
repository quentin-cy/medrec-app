from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    api_key: str
    db_path: str = "./medrec.db"

    model_config = {"env_prefix": "MEDREC_", "env_file": ".env"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
