from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth import require_api_key
from app.database import get_db
from app.models.animal import Animal
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalResponse

router = APIRouter(
    prefix="/api/animals",
    tags=["animals"],
    dependencies=[Depends(require_api_key)],
)


@router.get("", response_model=list[AnimalResponse])
async def list_animals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Animal).order_by(Animal.name))
    return result.scalars().all()


@router.get("/{animal_id}", response_model=AnimalResponse)
async def get_animal(animal_id: str, db: AsyncSession = Depends(get_db)):
    animal = await db.get(Animal, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return animal


@router.post("", response_model=AnimalResponse, status_code=201)
async def create_animal(data: AnimalCreate, db: AsyncSession = Depends(get_db)):
    animal = Animal(**data.model_dump())
    db.add(animal)
    await db.commit()
    await db.refresh(animal)
    return animal


@router.put("/{animal_id}", response_model=AnimalResponse)
async def update_animal(
    animal_id: str, data: AnimalUpdate, db: AsyncSession = Depends(get_db)
):
    animal = await db.get(Animal, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(animal, field, value)
    animal.updated_at = datetime.now(timezone.utc).isoformat()

    await db.commit()
    await db.refresh(animal)
    return animal


@router.delete("/{animal_id}", status_code=204)
async def delete_animal(animal_id: str, db: AsyncSession = Depends(get_db)):
    animal = await db.get(Animal, animal_id)
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    await db.delete(animal)
    await db.commit()
