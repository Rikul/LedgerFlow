"""Database configuration and session management."""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
default_sqlite_path = os.path.join(BASE_DIR, 'ledgerflow.db')
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{default_sqlite_path}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))
Base = declarative_base()
