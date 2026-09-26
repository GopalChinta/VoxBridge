from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class SpeechRecordResponse(BaseModel):
    id: int
    user_id: int
    original_filename: Optional[str] = None
    audio_path: Optional[str] = None
    audio_url: Optional[str] = None
    detected_language: Optional[str] = None
    transcription: Optional[str] = None
    source_language: Optional[str] = None
    target_language: Optional[str] = None
    translation: Optional[str] = None
    generated_audio_path: Optional[str] = None
    generated_audio_url: Optional[str] = None
    pdf_path: Optional[str] = None
    pdf_url: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class HistoryListResponse(BaseModel):
    items: List[SpeechRecordResponse]
    total: int
