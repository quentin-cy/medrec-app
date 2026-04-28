import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.database import get_db
from app.config import get_settings, Settings
from app.models.animal import Base
from app.models import event as _event_models  # noqa: F401
from app.models import context as _context_models  # noqa: F401

TEST_API_KEY = "test-key-123"


def get_test_settings() -> Settings:
    return Settings(api_key=TEST_API_KEY, db_path=":memory:")


@pytest.fixture(autouse=True)
async def setup_db():
    engine = create_async_engine("sqlite+aiosqlite://", echo=False)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_settings] = get_test_settings

    yield

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.fixture
def headers():
    return {"X-API-Key": TEST_API_KEY}


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
