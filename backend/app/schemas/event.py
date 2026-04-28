from pydantic import BaseModel
from typing import Annotated, Literal, Union
from annotated_types import Ge


# --- Base ---


class EventBase(BaseModel):
    date: str


# --- Vaccination ---


class VaccinationEventCreate(EventBase):
    event_type: Literal["vaccination"] = "vaccination"
    types: list[Annotated[int, Ge(0)]]
    reference: str
    vet: Annotated[int, Ge(0)]


class VaccinationEventResponse(VaccinationEventCreate):
    id: str
    animal_id: str
    model_config = {"from_attributes": True}


# --- Pest Control ---


class PestControlEventCreate(EventBase):
    event_type: Literal["pest_control"] = "pest_control"
    type: Annotated[int, Ge(0)]
    reference: str
    comment: str = ""


class PestControlEventResponse(PestControlEventCreate):
    id: str
    animal_id: str
    model_config = {"from_attributes": True}


# --- Weighing ---


class WeighingEventCreate(EventBase):
    event_type: Literal["weighing"] = "weighing"
    weight_kg: float


class WeighingEventResponse(WeighingEventCreate):
    id: str
    animal_id: str
    model_config = {"from_attributes": True}


# --- Appointment ---


class AppointmentEventCreate(EventBase):
    event_type: Literal["appointment"] = "appointment"
    vet: Annotated[int, Ge(0)]
    comment: str = ""
    price: float = 0


class AppointmentEventResponse(AppointmentEventCreate):
    id: str
    animal_id: str
    model_config = {"from_attributes": True}


# --- Discriminated unions ---

EventCreate = Annotated[
    Union[
        VaccinationEventCreate,
        PestControlEventCreate,
        WeighingEventCreate,
        AppointmentEventCreate,
    ],
    "eventType",
]

EventResponse = Annotated[
    Union[
        VaccinationEventResponse,
        PestControlEventResponse,
        WeighingEventResponse,
        AppointmentEventResponse,
    ],
    "eventType",
]
