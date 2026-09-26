import os
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db
from app.routers import auth, speech, translation, tts, pdf, history

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database Tables
    init_db()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VoxBridge – AI-Powered Multilingual Speech, Translation, and Voice Platform",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend on localhost:5173, etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global safe error handler - Never expose internal stack traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log exception for server inspection
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred while processing your request. Please try again."}
    )

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(speech.router, prefix="/api")
app.include_router(translation.router, prefix="/api")
app.include_router(tts.router, prefix="/api")
app.include_router(pdf.router, prefix="/api")
app.include_router(history.router, prefix="/api")

# Static / Media Streaming Endpoints with path-traversal protection
@app.get("/api/files/audio/{filename}", tags=["File Storage"])
def get_audio_file(filename: str):
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(file_path, media_type="audio/webm")

@app.get("/api/files/generated/{filename}", tags=["File Storage"])
def get_generated_file(filename: str):
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(settings.GENERATED_DIR, safe_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Requested file not found")

    ext = os.path.splitext(safe_filename)[1].lower()
    media_type = "audio/mpeg" if ext == ".mp3" else ("application/pdf" if ext == ".pdf" else "application/octet-stream")
    return FileResponse(file_path, media_type=media_type, filename=safe_filename)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "tagline": settings.TAGLINE,
        "description": settings.DESCRIPTION,
        "docs": "/docs"
    }
