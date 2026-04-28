import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Float, Integer, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.animal import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    animal_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("animals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    event_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    date: Mapped[str] = mapped_column(String(10), nullable=False)

    # Vaccination fields
    types: Mapped[str | None] = mapped_column(JSON, nullable=True)  # list[int] as JSON
    reference: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # Shared: vaccination + appointment
    vet: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Pest control
    type: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Shared: pest_control + appointment
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Weighing
    weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Appointment
    price: Mapped[float | None] = mapped_column(Float, nullable=True)

    created_at: Mapped[str] = mapped_column(
        String(30), default=lambda: datetime.now(timezone.utc).isoformat()
    )
