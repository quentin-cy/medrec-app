import pytest
from httpx import AsyncClient

ANIMAL_DATA = {"name": "Buddy", "species": "Dog"}


async def _create_animal(client: AsyncClient, headers: dict) -> str:
    resp = await client.post("/api/animals", json=ANIMAL_DATA, headers=headers)
    return resp.json()["id"]


# --- Vaccination ---


@pytest.mark.asyncio
async def test_create_vaccination_event(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    resp = await client.post(
        f"/api/animals/{aid}/events",
        json={
            "event_type": "vaccination",
            "date": "2025-01-15",
            "types": [0, 1],
            "reference": "Nobivac",
            "vet": 0,
        },
        headers=headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["event_type"] == "vaccination"
    assert body["types"] == [0, 1]
    assert body["reference"] == "Nobivac"
    assert body["vet"] == 0
    assert body["animal_id"] == aid


# --- Pest Control ---


@pytest.mark.asyncio
async def test_create_pest_control_event(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    resp = await client.post(
        f"/api/animals/{aid}/events",
        json={
            "event_type": "pest_control",
            "date": "2025-02-10",
            "type": 0,
            "reference": "Frontline",
            "comment": "Applied topically",
        },
        headers=headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["event_type"] == "pest_control"
    assert body["type"] == 0
    assert body["comment"] == "Applied topically"


# --- Weighing ---


@pytest.mark.asyncio
async def test_create_weighing_event(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    resp = await client.post(
        f"/api/animals/{aid}/events",
        json={"event_type": "weighing", "date": "2025-03-01", "weight_kg": 12.5},
        headers=headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["event_type"] == "weighing"
    assert body["weight_kg"] == 12.5


# --- Appointment ---


@pytest.mark.asyncio
async def test_create_appointment_event(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    resp = await client.post(
        f"/api/animals/{aid}/events",
        json={
            "event_type": "appointment",
            "date": "2025-04-20",
            "vet": 1,
            "comment": "Annual checkup",
            "price": 75.50,
        },
        headers=headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["event_type"] == "appointment"
    assert body["vet"] == 1
    assert body["price"] == 75.50


# --- List ---


@pytest.mark.asyncio
async def test_list_events(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    await client.post(
        f"/api/animals/{aid}/events",
        json={"event_type": "weighing", "date": "2025-01-01", "weight_kg": 10},
        headers=headers,
    )
    await client.post(
        f"/api/animals/{aid}/events",
        json={"event_type": "weighing", "date": "2025-02-01", "weight_kg": 11},
        headers=headers,
    )
    resp = await client.get(f"/api/animals/{aid}/events", headers=headers)
    assert resp.status_code == 200
    events = resp.json()
    assert len(events) == 2
    # Most recent first
    assert events[0]["date"] == "2025-02-01"
    assert events[1]["date"] == "2025-01-01"


@pytest.mark.asyncio
async def test_list_events_animal_not_found(client: AsyncClient, headers):
    resp = await client.get("/api/animals/nonexistent/events", headers=headers)
    assert resp.status_code == 404


# --- Get ---


@pytest.mark.asyncio
async def test_get_event(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    create_resp = await client.post(
        f"/api/animals/{aid}/events",
        json={"event_type": "weighing", "date": "2025-01-01", "weight_kg": 10},
        headers=headers,
    )
    eid = create_resp.json()["id"]
    resp = await client.get(f"/api/animals/{aid}/events/{eid}", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["weight_kg"] == 10


@pytest.mark.asyncio
async def test_get_event_not_found(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    resp = await client.get(f"/api/animals/{aid}/events/nonexistent", headers=headers)
    assert resp.status_code == 404


# --- Delete ---


@pytest.mark.asyncio
async def test_delete_event(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    create_resp = await client.post(
        f"/api/animals/{aid}/events",
        json={"event_type": "weighing", "date": "2025-01-01", "weight_kg": 10},
        headers=headers,
    )
    eid = create_resp.json()["id"]
    resp = await client.delete(f"/api/animals/{aid}/events/{eid}", headers=headers)
    assert resp.status_code == 204
    resp = await client.get(f"/api/animals/{aid}/events/{eid}", headers=headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_event_not_found(client: AsyncClient, headers):
    aid = await _create_animal(client, headers)
    resp = await client.delete(
        f"/api/animals/{aid}/events/nonexistent", headers=headers
    )
    assert resp.status_code == 404


# --- Create event for nonexistent animal ---


@pytest.mark.asyncio
async def test_create_event_animal_not_found(client: AsyncClient, headers):
    resp = await client.post(
        "/api/animals/nonexistent/events",
        json={"event_type": "weighing", "date": "2025-01-01", "weight_kg": 10},
        headers=headers,
    )
    assert resp.status_code == 404
