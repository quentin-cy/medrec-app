import pytest
from httpx import AsyncClient

ANIMAL_DATA = {
    "name": "Buddy",
    "species": "Dog",
    "breed": "Golden Retriever",
    "date_of_birth": "2020-03-15",
    "sex": "male",
}


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_no_api_key_returns_401(client: AsyncClient):
    resp = await client.get("/api/animals")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_wrong_api_key_returns_401(client: AsyncClient):
    resp = await client.get("/api/animals", headers={"X-API-Key": "wrong"})
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_create_animal(client: AsyncClient, headers):
    resp = await client.post("/api/animals", json=ANIMAL_DATA, headers=headers)
    assert resp.status_code == 201
    body = resp.json()
    assert body["name"] == "Buddy"
    assert body["species"] == "Dog"
    assert body["breed"] == "Golden Retriever"
    assert body["sex"] == "male"
    assert "id" in body
    assert "created_at" in body
    assert "updated_at" in body


@pytest.mark.asyncio
async def test_create_animal_minimal(client: AsyncClient, headers):
    resp = await client.post(
        "/api/animals",
        json={"name": "Cat", "species": "Cat"},
        headers=headers,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["breed"] == ""
    assert body["sex"] == "unknown"
    assert body["microchip_id"] is None


@pytest.mark.asyncio
async def test_list_animals_empty(client: AsyncClient, headers):
    resp = await client.get("/api/animals", headers=headers)
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_list_animals(client: AsyncClient, headers):
    await client.post("/api/animals", json=ANIMAL_DATA, headers=headers)
    await client.post(
        "/api/animals",
        json={"name": "Whiskers", "species": "Cat"},
        headers=headers,
    )
    resp = await client.get("/api/animals", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 2


@pytest.mark.asyncio
async def test_get_animal(client: AsyncClient, headers):
    create_resp = await client.post("/api/animals", json=ANIMAL_DATA, headers=headers)
    animal_id = create_resp.json()["id"]
    resp = await client.get(f"/api/animals/{animal_id}", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Buddy"


@pytest.mark.asyncio
async def test_get_animal_not_found(client: AsyncClient, headers):
    resp = await client.get("/api/animals/nonexistent", headers=headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_animal(client: AsyncClient, headers):
    create_resp = await client.post("/api/animals", json=ANIMAL_DATA, headers=headers)
    animal_id = create_resp.json()["id"]
    resp = await client.put(
        f"/api/animals/{animal_id}",
        json={"name": "Buddy Jr.", "breed": "Labrador"},
        headers=headers,
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["name"] == "Buddy Jr."
    assert body["breed"] == "Labrador"
    assert body["species"] == "Dog"


@pytest.mark.asyncio
async def test_update_animal_not_found(client: AsyncClient, headers):
    resp = await client.put(
        "/api/animals/nonexistent",
        json={"name": "Ghost"},
        headers=headers,
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_animal(client: AsyncClient, headers):
    create_resp = await client.post("/api/animals", json=ANIMAL_DATA, headers=headers)
    animal_id = create_resp.json()["id"]
    resp = await client.delete(f"/api/animals/{animal_id}", headers=headers)
    assert resp.status_code == 204
    resp = await client.get(f"/api/animals/{animal_id}", headers=headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_animal_not_found(client: AsyncClient, headers):
    resp = await client.delete("/api/animals/nonexistent", headers=headers)
    assert resp.status_code == 404
