import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.database import get_db
from app.config import get_settings, Settings
from app.models.animal import Base

TEST_API_KEY = "test-key-123"


def get_test_settings() -> Settings:
    return Settings(api_key=TEST_API_KEY, db_path=":memory:")


# In-memory DB, shared across a single test
_test_engine = None
_test_session_factory = None


@pytest.fixture(autouse=True)
async def setup_db():
    global _test_engine, _test_session_factory

    _test_engine = create_async_engine("sqlite+aiosqlite://", echo=False)
    _test_session_factory = async_sessionmaker(
        _test_engine, class_=AsyncSession, expire_on_commit=False
    )

    async with _test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_db():
        async with _test_session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_settings] = get_test_settings

    yield

    app.dependency_overrides.clear()
    await _test_engine.dispose()


@pytest.fixture
def headers():
    return {"X-API-Key": TEST_API_KEY}


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


ANIMAL_DATA = {
    "name": "Buddy",
    "species": "Dog",
    "breed": "Golden Retriever",
    "date_of_birth": "2020-03-15",
    "sex": "male",
}


# --- Health ---


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


# --- Auth ---


@pytest.mark.asyncio
async def test_no_api_key_returns_401(client: AsyncClient):
    resp = await client.get("/api/animals")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_wrong_api_key_returns_401(client: AsyncClient):
    resp = await client.get("/api/animals", headers={"X-API-Key": "wrong"})
    assert resp.status_code == 401


# --- Create ---


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


# --- List ---


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
    animals = resp.json()
    assert len(animals) == 2


# --- Get ---


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


# --- Update ---


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
    # species unchanged
    assert body["species"] == "Dog"


@pytest.mark.asyncio
async def test_update_animal_not_found(client: AsyncClient, headers):
    resp = await client.put(
        "/api/animals/nonexistent",
        json={"name": "Ghost"},
        headers=headers,
    )
    assert resp.status_code == 404


# --- Delete ---


@pytest.mark.asyncio
async def test_delete_animal(client: AsyncClient, headers):
    create_resp = await client.post("/api/animals", json=ANIMAL_DATA, headers=headers)
    animal_id = create_resp.json()["id"]

    resp = await client.delete(f"/api/animals/{animal_id}", headers=headers)
    assert resp.status_code == 204

    # Verify gone
    resp = await client.get(f"/api/animals/{animal_id}", headers=headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_animal_not_found(client: AsyncClient, headers):
    resp = await client.delete("/api/animals/nonexistent", headers=headers)
    assert resp.status_code == 404
