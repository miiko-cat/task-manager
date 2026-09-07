from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_validator

class TaskCreate(BaseModel):
  """POST /tasks で受け取る形。"""
  
  title: str = Field(min_length=1, max_length=200)

class TaskUpdate(BaseModel):
  """PATCH /tasks/{id} で受け取る形。送られた項目だけを更新する。"""
  
  title: str | None = Field(default=None, min_length=1, max_length=200)
  done: bool | None = None
  
class TaskRead(BaseModel):
  """API が返す形。"""
  
  model_config = ConfigDict(from_attributes=True)

  id: int
  title: str
  done: bool
  created_at: datetime
  
  @field_validator("created_at")
  @classmethod
  def ensure_utc(cls, value: datetime) -> datetime:
    # SQLite はタイムゾーン情報を保存できないため、
    # 素の datetime が返ってきたら UTC として明示する。
    if value.tzinfo is None:
      return value.replace(tzinfo=timezone.utc)
    return value