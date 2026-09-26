import os
import uuid
import re
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings

def sanitize_filename(filename: str) -> str:
    """Sanitizes user filename and prevents path traversal."""
    # Keep only alphanumeric, dashes, dots, underscores
    clean = re.sub(r'[^a-zA-Z0-9_.-]', '_', os.path.basename(filename))
    ext = os.path.splitext(clean)[1].lower()
    base = os.path.splitext(clean)[0][:50]
    unique_prefix = uuid.uuid4().hex[:8]
    return f"{unique_prefix}_{base}{ext}"

def validate_audio_file(file: UploadFile):
    """Validates uploaded audio file extension and mime type."""
    filename = file.filename or "recording.webm"
    ext = os.path.splitext(filename)[1].lower()

    if ext not in settings.ALLOWED_AUDIO_EXTENSIONS and not file.content_type.startswith("audio/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed audio types: {', '.join(settings.ALLOWED_AUDIO_EXTENSIONS)}"
        )

async def save_uploaded_audio(file: UploadFile) -> tuple[str, str]:
    """Saves uploaded audio file to storage directory with size limit check."""
    validate_audio_file(file)
    safe_name = sanitize_filename(file.filename or "recording.webm")
    destination_path = os.path.join(settings.UPLOAD_DIR, safe_name)

    size = 0
    with open(destination_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):  # 1MB chunks
            size += len(chunk)
            if size > settings.MAX_FILE_SIZE_BYTES:
                buffer.close()
                if os.path.exists(destination_path):
                    os.remove(destination_path)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"Audio file exceeds maximum size limit of {settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB."
                )
            buffer.write(chunk)

    return destination_path, safe_name
