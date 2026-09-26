from typing import Optional
from pydantic import BaseModel

class SpeechRecordBase(BaseModel):
    original_filename: Optional[str] = None
    detected_language: Optional[str] = None
    transcription: Optional[str] = None
    source_language: Optional[str] = None
    target_language: Optional[str] = None
    translation: Optional[str] = None
    status: str = "completed"

class TranscriptionResponse(BaseModel):
    record_id: Optional[int] = None
    original_filename: str
    detected_language: str
    transcription: str
    status: str = "completed"
    audio_url: Optional[str] = None
