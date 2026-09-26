from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

# Handle sqlite specific connect args
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True
    )
except Exception as e:
    # Fallback to local SQLite if postgres connection string fails during startup
    print(f"Failed to initialize database with {settings.DATABASE_URL}: {e}. Falling back to SQLite.")
    fallback_url = "sqlite:///./voxbridge.db"
    engine = create_engine(fallback_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """FastAPI dependency for yielding database session."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes database tables."""
    # Import all models to register them on Base.metadata
    from app.models.user import User  # noqa
    from app.models.speech_record import SpeechRecord  # noqa
    Base.metadata.create_all(bind=engine)
