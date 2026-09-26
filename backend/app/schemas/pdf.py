from typing import Optional
from pydantic import BaseModel, Field

class PDFGenerateRequest(BaseModel):
    record_id: Optional[int] = Field(None, description="Optional associated speech record ID")
    original_text: Optional[str] = None
    detected_language: Optional[str] = None
    source_language: Optional[str] = None
    target_language: Optional[str] = None
    translation: Optional[str] = None
    filename: Optional[str] = None

class PDFResponse(BaseModel):
    record_id: Optional[int] = None
    pdf_url: str
    filename: str
    message: str = "PDF generated successfully"
