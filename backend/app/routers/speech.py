from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.speech_record import SpeechRecord
from app.services.whisper_service import whisper_service
from app.utils.file_handler import save_uploaded_audio
from app.schemas.speech import TranscriptionResponse

router = APIRouter(prefix="/speech", tags=["Speech Processing"])

@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_speech(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Uploads audio file (recorded or uploaded), processes it with Whisper STT,
    detects the spoken language, and persists the initial record in the user's history.
    """
    file_path, safe_name = await save_uploaded_audio(file)

    try:
        result = whisper_service.transcribe(file_path)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech-to-text processing failed: {str(e)}"
        )

    # Persist record in database
    record = SpeechRecord(
        user_id=current_user.id,
        original_filename=file.filename or safe_name,
        audio_path=safe_name,
        detected_language=result["detected_language"],
        source_language=result["detected_language"],
        transcription=result["transcription"],
        status="transcribed"
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return TranscriptionResponse(
        record_id=record.id,
        original_filename=record.original_filename,
        detected_language=record.detected_language,
        transcription=record.transcription,
        status=record.status,
        audio_url=f"/api/files/audio/{safe_name}"
    )

@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Direct audio upload validation and storage endpoint."""
    file_path, safe_name = await save_uploaded_audio(file)
    return {
        "filename": safe_name,
        "original_name": file.filename,
        "audio_url": f"/api/files/audio/{safe_name}",
        "message": "File uploaded and validated successfully"
    }
