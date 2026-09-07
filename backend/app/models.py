from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base 


def utc_now() -> datetime:
  return datetime.now(timezone.utc)

class Task(Base):
  __tablename__ = "tasks"
  
  id: Mapped[int] = mapped_column(Integer, primary_key=True)
  title: Mapped[str] = mapped_column(String(200), nullable=False)
  done: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True), nullable=False, default=utc_now
  )