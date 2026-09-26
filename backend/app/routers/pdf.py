from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.speech_record import SpeechRecord
from app.services.pdf_service import pdf_service
from app.schemas.pdf import PDFGenerateRequest, PDFResponse

router = APIRouter(prefix="/pdf", tags=["PDF Generation"])

@router.post("/generate", response_model=PDFResponse)
def generate_pdf(
    payload: PDFGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates an official formatted PDF report via ReportLab containing
    transcription, detected language, translation, and session metadata.
    """
    transcription = payload.original_text or ""
    detected_lang = payload.detected_language or "English"
    source_lang = payload.source_language or detected_lang
    target_lang = payload.target_language or "N/A"
    translation = payload.translation or ""
    session_id = str(payload.record_id) if payload.record_id else None

    # If record_id provided, fetch data from record
    if payload.record_id:
        record = db.query(SpeechRecord).filter(
            SpeechRecord.id == payload.record_id,
            SpeechRecord.user_id == current_user.id
        ).first()

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Speech record not found or access denied."
            )

        transcription = record.transcription or transcription
        detected_lang = record.detected_language or detected_lang
        source_lang = record.source_language or source_lang
        target_lang = record.target_language or target_lang
        translation = record.translation or translation

    try:
        output_path, filename = pdf_service.generate_session_pdf(
            user_name=current_user.name,
            user_email=current_user.email,
            detected_language=detected_lang,
            transcription=transcription,
            source_language=source_lang,
            target_language=target_lang,
            translation=translation,
            session_id=session_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation error: {str(e)}"
        )

    pdf_url = f"/api/files/generated/{filename}"

    if payload.record_id and record:
        record.pdf_path = filename
        db.commit()

    return PDFResponse(
        record_id=payload.record_id,
        pdf_url=pdf_url,
        filename=filename,
        message="PDF report generated successfully"
    )
