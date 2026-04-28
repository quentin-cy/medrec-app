import pytest
from httpx import AsyncClient


# --- Vaccination types ---


@pytest.mark.asyncio
async def test_vaccination_types_crud(client: AsyncClient, headers):
    # Empty initially
    resp = await client.get("/api/context/vaccination-types", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == []

    # Create
    resp = await client.post(
        "/api/context/vaccination-types",
        json={"value": 0, "label": "Rabies"},
        headers=headers,
    )
    assert resp.status_code == 201
    assert resp.json() == {"value": 0, "label": "Rabies"}

    # Duplicate
    resp = await client.post(
        "/api/context/vaccination-types",
        json={"value": 0, "label": "Rabies Again"},
        headers=headers,
    )
    assert resp.status_code == 409

    # List
    resp = await client.get("/api/context/vaccination-types", headers=headers)
    assert len(resp.json()) == 1

    # Delete
    resp = await client.delete("/api/context/vaccination-types/0", headers=headers)
    assert resp.status_code == 204

    # Delete not found
    resp = await client.delete("/api/context/vaccination-types/99", headers=headers)
    assert resp.status_code == 404


# --- Pest control types ---


@pytest.mark.asyncio
async def test_pest_control_types_crud(client: AsyncClient, headers):
    resp = await client.post(
        "/api/context/pest-control-types",
        json={"value": 0, "label": "Dewormer"},
        headers=headers,
    )
    assert resp.status_code == 201

    resp = await client.get("/api/context/pest-control-types", headers=headers)
    assert len(resp.json()) == 1

    resp = await client.delete("/api/context/pest-control-types/0", headers=headers)
    assert resp.status_code == 204


# --- Vets ---


@pytest.mark.asyncio
async def test_vets_crud(client: AsyncClient, headers):
    resp = await client.post(
        "/api/context/vets",
        json={"value": 0, "name": "Dr. Smith", "practice": "VetCare"},
        headers=headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["name"] == "Dr. Smith"
    assert body["practice"] == "VetCare"

    # Duplicate
    resp = await client.post(
        "/api/context/vets",
        json={"value": 0, "name": "Dr. Jones"},
        headers=headers,
    )
    assert resp.status_code == 409

    resp = await client.get("/api/context/vets", headers=headers)
    assert len(resp.json()) == 1

    resp = await client.delete("/api/context/vets/0", headers=headers)
    assert resp.status_code == 204

    resp = await client.delete("/api/context/vets/99", headers=headers)
    assert resp.status_code == 404


# --- Full context ---


@pytest.mark.asyncio
async def test_get_full_context(client: AsyncClient, headers):
    await client.post(
        "/api/context/vaccination-types",
        json={"value": 0, "label": "Rabies"},
        headers=headers,
    )
    await client.post(
        "/api/context/pest-control-types",
        json={"value": 0, "label": "Dewormer"},
        headers=headers,
    )
    await client.post(
        "/api/context/vets",
        json={"value": 0, "name": "Dr. Smith"},
        headers=headers,
    )

    resp = await client.get("/api/context", headers=headers)
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["vaccination_types"]) == 1
    assert len(body["pest_control_types"]) == 1
    assert len(body["vets"]) == 1
