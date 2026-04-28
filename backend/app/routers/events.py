from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth import require_api_key
from app.database import get_db
from app.models.animal import Animal
from app.models.event import Event
from app.schemas.event import (
    EventCreate,
    VaccinationEventResponse,
    PestControlEventResponse,
    WeighingEventResponse,
    AppointmentEventResponse,
)

router = APIRouter(
    prefix="/api/animals/{animal_id}/events",
    tags=["events"],
    dependencies=[Depends(require_api_key)],
)

RESPONSE_MAP = {
    "vaccination": VaccinationEventResponse,
    "pest_control": PestControlEventResponse,
    "weighing": WeighingEventResponse,
    "appointment": AppointmentEventResponse,
}


def _event_to_response(event: Event):
    schema = RESPONSE_MAP.get(event.event_type)
    if not schema:
        raise ValueError(f"Unknown event type: {event.event_type}")
    return schema.model_validate(event)


@router.get("")
async def list_events(animal_id: str, db: AsyncSession = Depends(get_db)):
    animal = await db.get(Animal, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    result = await db.execute(
        select(Event).where(Event.animal_id == animal_id).order_by(Event.date.desc())
    )
    events = result.scalars().all()
    return [_event_to_response(e) for e in events]


@router.get("/{event_id}")
async def get_event(animal_id: str, event_id: str, db: AsyncSession = Depends(get_db)):
    event = await db.get(Event, event_id)
    if not event or event.animal_id != animal_id:
        raise HTTPException(status_code=404, detail="Event not found")
    return _event_to_response(event)


@router.post("", status_code=201)
async def create_event(
    animal_id: str, data: EventCreate, db: AsyncSession = Depends(get_db)
):
    animal = await db.get(Animal, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    event_data = data.model_dump()
    event = Event(animal_id=animal_id, **event_data)
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return _event_to_response(event)


@router.delete("/{event_id}", status_code=204)
async def delete_event(
    animal_id: str, event_id: str, db: AsyncSession = Depends(get_db)
):
    event = await db.get(Event, event_id)
    if not event or event.animal_id != animal_id:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(event)
    await db.commit()
