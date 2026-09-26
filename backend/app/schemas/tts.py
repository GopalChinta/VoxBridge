from typing import Optional
from pydantic import BaseModel, Field

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to synthesize into speech")
    language: str = Field(..., description="Target language: English, Telugu, or Hindi")
    record_id: Optional[int] = Field(None, description="Optional associated speech record ID")

class TTSResponse(BaseModel):
    record_id: Optional[int] = None
    language: str
    audio_url: str
    filename: str
    message: str = "Audio generated successfully"
