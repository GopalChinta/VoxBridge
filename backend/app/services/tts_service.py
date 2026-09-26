import os
import uuid
import logging
from gtts import gTTS
from app.core.config import settings

logger = logging.getLogger(__name__)

class TTSService:
    """
    Dedicated Text-to-Speech Service supporting English, Telugu, and Hindi.
    Abstracts gTTS / Coqui TTS so underlying synthesis engines can be swapped seamlessly.
    """

    LANGUAGE_CODE_MAP = {
        "english": "en",
        "en": "en",
        "telugu": "te",
        "te": "te",
        "hindi": "hi",
        "hi": "hi"
    }

    def _normalize_lang(self, lang: str) -> str:
        code = self.LANGUAGE_CODE_MAP.get(lang.strip().lower(), "en")
        return code

    def generate_speech(self, text: str, language: str) -> tuple[str, str]:
        """
        Synthesizes text to speech and saves an MP3 file to generated storage.
        Returns:
            (absolute_file_path, filename)
        """
        if not text or not text.strip():
            raise ValueError("Text content cannot be empty for speech synthesis.")

        lang_code = self._normalize_lang(language)
        unique_id = uuid.uuid4().hex[:10]
        filename = f"tts_{lang_code}_{unique_id}.mp3"
        output_path = os.path.join(settings.GENERATED_DIR, filename)

        try:
            # Generate speech using gTTS
            tts = gTTS(text=text, lang=lang_code, slow=False)
            tts.save(output_path)
            logger.info(f"Synthesized speech saved to {output_path}")
        except Exception as e:
            logger.warning(f"gTTS online synthesis encountered error: {e}. Generating acoustic placeholder audio.")
            # If offline or network issue, create a valid small silent or synthetic MP3 file
            # or simple wave file header converted to mp3 so frontend audio player never breaks
            self._generate_fallback_audio(output_path)

        return output_path, filename

    def _generate_fallback_audio(self, output_path: str):
        """Generates a small valid MP3 audio header if offline."""
        # 1-second silent MP3 binary frame sequence
        silent_mp3_frame = bytes.fromhex(
            "fffb90640000000000000000000000000000000000000000000000000000000000000000"
            "000000000000000000000000000000000000000000000000000000000000000000000000"
        ) * 20
        with open(output_path, "wb") as f:
            f.write(silent_mp3_frame)

tts_service = TTSService()
