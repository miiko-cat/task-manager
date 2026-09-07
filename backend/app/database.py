import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/tasks.db")

# SQLite は既定で「接続を作ったスレッド以外からの利用」を禁止する。
# FastAPI はリクエストごとに別スレッドを使うことがあるため、この制限を外す。
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class Base(DeclarativeBase):
  """全モデルの基底クラス。"""
  
  
def get_db():
  """リクエスト1件につき1つのセッションを貸し出し、終了時に必ず閉じる。"""
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()