from pydantic import BaseModel


class TypeOptionCreate(BaseModel):
    value: int
    label: str


class TypeOptionResponse(TypeOptionCreate):
    model_config = {"from_attributes": True}


class VetCreate(BaseModel):
    value: int
    name: str
    practice: str = ""


class VetResponse(VetCreate):
    model_config = {"from_attributes": True}


class ContextResponse(BaseModel):
    vaccination_types: list[TypeOptionResponse]
    pest_control_types: list[TypeOptionResponse]
    vets: list[VetResponse]
