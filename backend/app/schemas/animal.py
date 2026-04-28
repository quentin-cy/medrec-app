from pydantic import BaseModel
from enum import Enum


class Sex(str, Enum):
    male = "male"
    female = "female"
    unknown = "unknown"


class AnimalCreate(BaseModel):
    name: str
    species: str
    breed: str = ""
    date_of_birth: str = ""
    sex: Sex = Sex.unknown
    microchip_id: str | None = None


class AnimalUpdate(BaseModel):
    name: str | None = None
    species: str | None = None
    breed: str | None = None
    date_of_birth: str | None = None
    sex: Sex | None = None
    microchip_id: str | None = None


class AnimalResponse(BaseModel):
    id: str
    name: str
    species: str
    breed: str
    date_of_birth: str
    sex: Sex
    microchip_id: str | None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
