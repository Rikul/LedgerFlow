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


class DatabaseManager:
    """Lightweight wrapper exposing SQLAlchemy attributes expected by Flask-Migrate."""

    def __init__(self, engine, session_factory, base):
        self._engine = engine
        self._session_factory = session_factory
        self._base = base

    # -- Attributes used by Flask-Migrate -------------------------------------------------
    @property
    def metadata(self):
        return self._base.metadata

    @property
    def engine(self):
        return self._engine

    @property
    def session(self):
        return self._session_factory

    # -- Helper methods ------------------------------------------------------------------
    def get_engine(self, app=None, bind=None):
        """Mimic Flask-SQLAlchemy's ``get_engine`` API used by Flask-Migrate."""
        return self._engine

    def get_metadata(self):
        return self._base.metadata

    def create_all(self):
        self._base.metadata.create_all(bind=self._engine)

    def drop_all(self):
        self._base.metadata.drop_all(bind=self._engine)

    def dispose(self):
        self._engine.dispose()


database_manager = DatabaseManager(engine, SessionLocal, Base)
