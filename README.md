# VoxBridge

<div align="center">

![VoxBridge Logo](https://img.shields.io/badge/VoxBridge-AI--Powered%20Multilingual%20Platform-4F46E5?style=for-the-badge&logo=soundcharts&logoColor=white)

### **“Speak. Translate. Connect.”**
*AI-powered multilingual speech, translation, and voice platform.*

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 Overview

**VoxBridge** is a modern, responsive, AI-powered multilingual speech-processing platform that bridges spoken voice, written text, translation, and synthesized speech across languages. 

Initially tailored for **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**, VoxBridge allows users to speak naturally into their browser or upload audio files, automatically converts speech to text using **OpenAI Whisper**, detects the spoken language, translates across Indian language pairs with **Indic neural models**, synthesizes spoken voice in the target language, and downloads verified **ReportLab PDF reports** for official record keeping.

---

## ✨ Features

- **🔐 Cryptographic Authentication**: Secure registration and login with salted bcrypt password hashing and JWT (JSON Web Tokens). User data and history are strictly isolated.
- **🎙️ In-Browser Speech Recording**: Native Web MediaRecorder API integration with real-time waveform visualizer (Web Audio Analyser), duration counter, pause/resume, and audio playback preview.
- **📁 Multi-Format Audio Uploader**: Drag-and-drop audio file upload supporting **WAV, MP3, M4A, WebM, and OGG** with frontend and backend file validation and a 25MB file-size limit.
- **🧠 Whisper Speech-to-Text**: Automatic speech recognition powered by OpenAI Whisper, detecting spoken languages (English, Telugu, Hindi) and transcribing speech with precision.
- **🌐 Multilingual Neural Translation**: Bidirectional translation between **English ↔ Telugu**, **English ↔ Hindi**, and **Telugu ↔ Hindi** powered by IndicTrans2 / AI4Bharat architecture with offline contextual fallbacks.
- **🔊 Natural Voice Synthesis (TTS)**: High-fidelity Text-to-Speech generation powered by gTTS with native pronunciation for Indian languages, custom audio playback, scrubber, volume control, and direct MP3 downloads.
- **📄 Verified ReportLab PDF Reports**: High quality, formatted PDF reports featuring VoxBridge branding, timestamps, user info, side-by-side transcripts, and verification metadata.
- **🗂️ Speech History Vault**: Searchable and filterable history page allowing users to view, re-listen, copy text, export PDFs, and permanently delete their own past records.
- **🎨 Premium Dark AI SaaS Aesthetic**: Minimal cards, soft borders, rounded corners, subtle neon cyan/violet gradients, and smooth animations inspired by modern AI products.
- **📱 Fully Responsive**: Seamlessly adapts across Desktop, Laptop, Tablet, and Mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios, Web MediaRecorder API, Web Audio Analyser API |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy ORM, Pydantic v2, Uvicorn, Passlib (Bcrypt), Python-Jose, Python-Multipart |
| **Database** | PostgreSQL (Production) / SQLite (Zero-config local development) |
| **AI & Speech** | OpenAI Whisper (STT & Language ID), IndicTrans2 / Deep-Translator / AI4Bharat (Translation), gTTS (Text-to-Speech) |
| **Document Generation** | ReportLab (Custom PDF Layouts) |

---

## 🏛️ System Architecture

```mermaid
graph TD
    User([User / Browser]) -->|Voice / Audio / Text| Frontend[React + Vite Frontend]
    Frontend -->|Axios REST + JWT| API[FastAPI Backend Gateway]
    
    subgraph "FastAPI Backend"
        Auth[Auth Router & JWT Security]
        Speech[Speech Router]
        Trans[Translation Router]
        TTS[TTS Router]
        PDF[PDF Router]
        History[History Router]
    end

    API --> Auth
    API --> Speech
    API --> Trans
    API --> TTS
    API --> PDF
    API --> History

    subgraph "Core AI Services"
        WhisperSvc[Whisper STT & Language Detection]
        TransSvc[IndicTrans2 / AI4Bharat Neural Translator]
        TTSSvc[gTTS Multilingual Voice Synthesizer]
        PDFSvc[ReportLab PDF Document Engine]
    end

    Speech --> WhisperSvc
    Trans --> TransSvc
    TTS --> TTSSvc
    PDF --> PDFSvc

    subgraph "Storage & Database"
        DB[(PostgreSQL / SQLite Database)]
        Uploads[Uploads Directory]
        Generated[Generated Audio & PDF Storage]
    end

    Auth --> DB
    History --> DB
    Speech --> Uploads
    Speech --> DB
    TTS --> Generated
    TTS --> DB
    PDF --> Generated
    PDF --> DB
```

---

## 🚀 Quickstart Installation Guide

### Prerequisites
- **Node.js** (v18+ or v20+)
- **Python** (v3.10+ or v3.11+)
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/GopalChinta/VoxBridge.git
cd VoxBridge
```

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure environment variables
cp .env.example .env

# Run FastAPI backend server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend server will start at: `http://127.0.0.1:8000`
- Swagger Interactive Documentation: `http://127.0.0.1:8000/docs`
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

---

### 3. Frontend Setup

In a separate terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend application will be live at: `http://127.0.0.1:5173`

---

## 🔒 Environment Variables

Copy `.env.example` to `.env`:

```ini
# VoxBridge Environment Configuration
PROJECT_NAME=VoxBridge
VERSION=1.0.0
TAGLINE="Speak. Translate. Connect."

# JWT Secret (Generate a strong 64-character secret in production)
SECRET_KEY=voxbridge-production-super-secret-key-change-this-value-securely-2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database Configuration
# PostgreSQL: postgresql://username:password@localhost:5432/voxbridge
# SQLite (Local Dev): sqlite:///./voxbridge.db
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voxbridge

# Audio Uploads & Limits (25MB)
MAX_FILE_SIZE_BYTES=26214400
```

---

## 📡 REST API Reference

### Authentication
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `POST` | `/api/auth/logout` | Terminate session | Yes |

### Speech & Audio Processing
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/speech/transcribe` | Upload/record audio and transcribe with Whisper | Yes |
| `POST` | `/api/speech/upload` | Direct audio upload & validation | Yes |

### Translation & Voice
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/translation/translate` | Translate text between English, Telugu, Hindi | Yes |
| `POST` | `/api/tts/generate` | Synthesize speech in English, Telugu, Hindi | Yes |

### PDF & History
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/pdf/generate` | Generate branded ReportLab session report | Yes |
| `GET` | `/api/history` | List isolated history records for user | Yes |
| `GET` | `/api/history/{id}` | Retrieve individual history record details | Yes |
| `DELETE` | `/api/history/{id}` | Permanently delete record and media files | Yes |

---

## 🛡️ Security Architecture

1. **Strict User Record Isolation**: All history queries enforce `SpeechRecord.user_id == current_user.id`. Changing an ID in the URL or payload returns `404 Not Found`.
2. **Password Cryptography**: Salted Bcrypt hashing with standard 72-byte safe truncation. Plain text passwords are never persisted.
3. **JWT Bearer Enforcement**: Cryptographically signed access tokens validated on all sensitive routes with automatic expiration handling.
4. **File Safety & Sanitization**: Uploaded filenames are sanitized and assigned random UUID prefixes to block path traversal and collisions.

---

## 🔮 Future Enhancements

- [ ] **Expanded Indian Language Support**: Integration with Tamil, Kannada, Malayalam, Bengali, Marathi, and Gujarati.
- [ ] **Real-Time Streaming STT**: WebSocket-based live streaming transcription as you speak.
- [ ] **Voice Cloning & Custom Tones**: Custom timbre and speaker conditioning.
- [ ] **Cloud Storage Drivers**: S3 / Cloudflare R2 object storage drivers for audio persistence.
- [ ] **Mobile Applications**: Native iOS & Android companion applications.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <b>VoxBridge</b> — “Speak. Translate. Connect.”<br>
  Built with ❤️ for multilingual accessibility.
</div>
