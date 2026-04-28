from sqlalchemy import String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import uuid
from datetime import datetime, timezone


class Base(DeclarativeBase):
    pass


class Animal(Base):
    __tablename__ = "animals"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    species: Mapped[str] = mapped_column(String(255), nullable=False)
    breed: Mapped[str] = mapped_column(String(255), default="")
    date_of_birth: Mapped[str] = mapped_column(String(10), default="")
    sex: Mapped[str] = mapped_column(String(10), default="unknown")
    microchip_id: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    created_at: Mapped[str] = mapped_column(
        String(30),
        default=lambda: datetime.now(timezone.utc).isoformat(),
    )
    updated_at: Mapped[str] = mapped_column(
        String(30),
        default=lambda: datetime.now(timezone.utc).isoformat(),
        onupdate=lambda: datetime.now(timezone.utc).isoformat(),
    )
