from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.speech_record import SpeechRecord
from app.services.translation_service import translation_service
from app.schemas.translation import TranslationRequest, TranslationResponse

router = APIRouter(prefix="/translation", tags=["Translation"])

@router.post("/translate", response_model=TranslationResponse)
def translate_text(
    payload: TranslationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Translates text between English, Telugu, and Hindi using Indic neural models.
    Updates the existing speech record if record_id is provided.
    """
    try:
        translated_text = translation_service.translate(
            text=payload.text,
            source_lang=payload.source_language,
            target_lang=payload.target_language
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation engine error: {str(e)}"
        )

    # If associated with a record, verify user ownership and update
    if payload.record_id:
        record = db.query(SpeechRecord).filter(
            SpeechRecord.id == payload.record_id,
            SpeechRecord.user_id == current_user.id
        ).first()

        if record:
            record.source_language = payload.source_language
            record.target_language = payload.target_language
            record.translation = translated_text
            record.status = "translated"
            db.commit()

    return TranslationResponse(
        record_id=payload.record_id,
        original_text=payload.text,
        source_language=payload.source_language,
        target_language=payload.target_language,
        translation=translated_text
    )
