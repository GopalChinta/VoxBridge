from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class SpeechRecord(Base):
    __tablename__ = "speech_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_filename = Column(String(255), nullable=True)
    audio_path = Column(String(500), nullable=True)
    detected_language = Column(String(50), nullable=True)
    transcription = Column(Text, nullable=True)
    source_language = Column(String(50), nullable=True)
    target_language = Column(String(50), nullable=True)
    translation = Column(Text, nullable=True)
    generated_audio_path = Column(String(500), nullable=True)
    pdf_path = Column(String(500), nullable=True)
    status = Column(String(50), default="completed", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="speech_records")
