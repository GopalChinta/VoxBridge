import os
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.core.config import settings
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.speech_record import SpeechRecord
from app.schemas.history import HistoryListResponse, SpeechRecordResponse

router = APIRouter(prefix="/history", tags=["History Management"])

def _format_record_response(record: SpeechRecord) -> SpeechRecordResponse:
    return SpeechRecordResponse(
        id=record.id,
        user_id=record.user_id,
        original_filename=record.original_filename,
        audio_path=record.audio_path,
        audio_url=f"/api/files/audio/{record.audio_path}" if record.audio_path else None,
        detected_language=record.detected_language,
        transcription=record.transcription,
        source_language=record.source_language,
        target_language=record.target_language,
        translation=record.translation,
        generated_audio_path=record.generated_audio_path,
        generated_audio_url=f"/api/files/generated/{record.generated_audio_path}" if record.generated_audio_path else None,
        pdf_path=record.pdf_path,
        pdf_url=f"/api/files/generated/{record.pdf_path}" if record.pdf_path else None,
        status=record.status,
        created_at=record.created_at,
        updated_at=record.updated_at
    )

@router.get("", response_model=HistoryListResponse)
def get_user_history(
    search: Optional[str] = Query(None, description="Search keyword in transcription or translation"),
    language: Optional[str] = Query(None, description="Filter by detected or target language"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves speech processing history strictly isolated to the authenticated user.
    """
    query = db.query(SpeechRecord).filter(SpeechRecord.user_id == current_user.id)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (SpeechRecord.transcription.ilike(search_filter)) |
            (SpeechRecord.translation.ilike(search_filter)) |
            (SpeechRecord.original_filename.ilike(search_filter))
        )

    if language and language.lower() != "all":
        query = query.filter(
            (SpeechRecord.detected_language.ilike(language)) |
            (SpeechRecord.target_language.ilike(language))
        )

    total = query.count()
    records = query.order_by(SpeechRecord.created_at.desc()).offset(offset).limit(limit).all()

    return HistoryListResponse(
        items=[_format_record_response(r) for r in records],
        total=total
    )

@router.get("/{record_id}", response_model=SpeechRecordResponse)
def get_history_detail(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves details for a specific history record.
    Guarantees user isolation: cannot read records belonging to other users.
    """
    record = db.query(SpeechRecord).filter(
        SpeechRecord.id == record_id,
        SpeechRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Speech record not found or access denied."
        )

    return _format_record_response(record)

@router.delete("/{record_id}", status_code=status.HTTP_200_OK)
def delete_history_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently deletes a history record and any associated storage files.
    Guarantees user isolation: cannot delete records belonging to other users.
    """
    record = db.query(SpeechRecord).filter(
        SpeechRecord.id == record_id,
        SpeechRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Speech record not found or access denied."
        )

    # Clean up associated local files if present
    if record.audio_path:
        audio_file = os.path.join(settings.UPLOAD_DIR, record.audio_path)
        if os.path.exists(audio_file):
            try:
                os.remove(audio_file)
            except Exception:
                pass

    if record.generated_audio_path:
        gen_audio = os.path.join(settings.GENERATED_DIR, record.generated_audio_path)
        if os.path.exists(gen_audio):
            try:
                os.remove(gen_audio)
            except Exception:
                pass

    if record.pdf_path:
        pdf_file = os.path.join(settings.GENERATED_DIR, record.pdf_path)
        if os.path.exists(pdf_file):
            try:
                os.remove(pdf_file)
            except Exception:
                pass

    db.delete(record)
    db.commit()

    return {"message": "Record and associated media files deleted successfully", "id": record_id}
