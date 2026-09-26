from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.speech_record import SpeechRecord
from app.services.tts_service import tts_service
from app.schemas.tts import TTSRequest, TTSResponse

router = APIRouter(prefix="/tts", tags=["Text-to-Speech"])

@router.post("/generate", response_model=TTSResponse)
def generate_speech(
    payload: TTSRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Synthesizes text into high-fidelity speech for English, Telugu, or Hindi.
    Returns the streamable audio URL and associates it with the user's record.
    """
    try:
        output_path, filename = tts_service.generate_speech(
            text=payload.text,
            language=payload.language
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech synthesis error: {str(e)}"
        )

    audio_url = f"/api/files/generated/{filename}"

    # Update speech record if record_id provided
    if payload.record_id:
        record = db.query(SpeechRecord).filter(
            SpeechRecord.id == payload.record_id,
            SpeechRecord.user_id == current_user.id
        ).first()

        if record:
            record.generated_audio_path = filename
            record.status = "audio_generated"
            db.commit()

    return TTSResponse(
        record_id=payload.record_id,
        language=payload.language,
        audio_url=audio_url,
        filename=filename,
        message="Voice synthesized successfully"
    )
