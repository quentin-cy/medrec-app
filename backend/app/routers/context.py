from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth import require_api_key
from app.database import get_db
from app.models.context import VaccinationType, PestControlType, Vet
from app.schemas.context import (
    TypeOptionCreate,
    TypeOptionResponse,
    VetCreate,
    VetResponse,
    ContextResponse,
)

router = APIRouter(
    prefix="/api/context",
    tags=["context"],
    dependencies=[Depends(require_api_key)],
)


# --- Get all context ---


@router.get("", response_model=ContextResponse)
async def get_context(db: AsyncSession = Depends(get_db)):
    vax = (
        (await db.execute(select(VaccinationType).order_by(VaccinationType.value)))
        .scalars()
        .all()
    )
    pc = (
        (await db.execute(select(PestControlType).order_by(PestControlType.value)))
        .scalars()
        .all()
    )
    vets = (await db.execute(select(Vet).order_by(Vet.value))).scalars().all()
    return ContextResponse(
        vaccination_types=[TypeOptionResponse.model_validate(t) for t in vax],
        pest_control_types=[TypeOptionResponse.model_validate(t) for t in pc],
        vets=[VetResponse.model_validate(v) for v in vets],
    )


# --- Vaccination types ---


@router.get("/vaccination-types", response_model=list[TypeOptionResponse])
async def list_vaccination_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(VaccinationType).order_by(VaccinationType.value))
    return result.scalars().all()


@router.post("/vaccination-types", response_model=TypeOptionResponse, status_code=201)
async def create_vaccination_type(
    data: TypeOptionCreate, db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(
        select(VaccinationType).where(VaccinationType.value == data.value)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Value already exists")
    obj = VaccinationType(**data.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.delete("/vaccination-types/{value}", status_code=204)
async def delete_vaccination_type(value: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(VaccinationType).where(VaccinationType.value == value)
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="Vaccination type not found")
    await db.delete(obj)
    await db.commit()


# --- Pest control types ---


@router.get("/pest-control-types", response_model=list[TypeOptionResponse])
async def list_pest_control_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PestControlType).order_by(PestControlType.value))
    return result.scalars().all()


@router.post("/pest-control-types", response_model=TypeOptionResponse, status_code=201)
async def create_pest_control_type(
    data: TypeOptionCreate, db: AsyncSession = Depends(get_db)
):
    existing = await db.execute(
        select(PestControlType).where(PestControlType.value == data.value)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Value already exists")
    obj = PestControlType(**data.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.delete("/pest-control-types/{value}", status_code=204)
async def delete_pest_control_type(value: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PestControlType).where(PestControlType.value == value)
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="Pest control type not found")
    await db.delete(obj)
    await db.commit()


# --- Vets ---


@router.get("/vets", response_model=list[VetResponse])
async def list_vets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vet).order_by(Vet.value))
    return result.scalars().all()


@router.post("/vets", response_model=VetResponse, status_code=201)
async def create_vet(data: VetCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Vet).where(Vet.value == data.value))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Value already exists")
    obj = Vet(**data.model_dump())
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.delete("/vets/{value}", status_code=204)
async def delete_vet(value: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vet).where(Vet.value == value))
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="Vet not found")
    await db.delete(obj)
    await db.commit()
