import os

from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, engine, get_db

# スキーマが固まるまでは起動時にテーブルを作る。
# Alembic による移行管理は Phase 6 で導入する。
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API")

ALLOWED_ORIGINS = os.getenv(
  "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
  CORSMiddleware,
  allow_origins=ALLOWED_ORIGINS,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)


@app.get("/health")
def health():
  return {"status": "ok"}


@app.get("/tasks", response_model=list[schemas.TaskRead])
def list_tasks(db: Session = Depends(get_db)):
  stmt = select(models.Task).order_by(models.Task.created_at)
  return db.scalars(stmt).all()


@app.post("/tasks", response_model=schemas.TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: schemas.TaskCreate, db: Session = Depends(get_db)):
  task = models.Task(title=payload.title)
  db.add(task)
  db.commit()
  db.refresh(task)
  return task


@app.patch("/tasks/{task_id}", response_model=schemas.TaskRead)
def update_task(
    task_id: int, payload: schemas.TaskUpdate, db: Session = Depends(get_db)
):
  task = db.get(models.Task, task_id)
  if task is None:
      raise HTTPException(status_code=404, detail="Task not found")

  # 送られてこなかった項目は触らない
  for field, value in payload.model_dump(exclude_unset=True).items():
    setattr(task, field, value)

  db.commit()
  db.refresh(task)
  return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(models.Task, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)