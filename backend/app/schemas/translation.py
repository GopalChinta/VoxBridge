from typing import Optional
from pydantic import BaseModel, Field, field_validator

class TranslationRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to translate")
    source_language: str = Field(..., description="Source language (e.g. English, Telugu, Hindi)")
    target_language: str = Field(..., description="Target language (e.g. English, Telugu, Hindi)")
    record_id: Optional[int] = Field(None, description="Optional associated speech record ID")

    @field_validator("target_language")
    @classmethod
    def validate_languages(cls, v, values):
        if "source_language" in values.data and v.lower() == values.data["source_language"].lower():
            raise ValueError("Source and target languages cannot be identical.")
        return v

class TranslationResponse(BaseModel):
    record_id: Optional[int] = None
    original_text: str
    source_language: str
    target_language: str
    translation: str
