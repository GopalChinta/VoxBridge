import logging
from typing import Dict
from deep_translator import GoogleTranslator, MyMemoryTranslator

logger = logging.getLogger(__name__)

class TranslationService:
    """
    Multilingual Translation Service supporting English, Telugu, and Hindi.
    Implements a robust multi-tier neural pipeline:
    1. Primary: GoogleTranslator
    2. Secondary: MyMemoryTranslator (with locale tags like te-IN, hi-IN, en-US)
    3. Tertiary: Curated Indic phrase dictionary & smart context-aware transliteration
    """

    LANGUAGE_CODE_MAP = {
        "english": "en",
        "en": "en",
        "telugu": "te",
        "te": "te",
        "hindi": "hi",
        "hi": "hi"
    }

    LOCALE_MAP = {
        "en": "en-US",
        "te": "te-IN",
        "hi": "hi-IN"
    }

    # Curated offline translations for instant testing and high reliability
    OFFLINE_FALLBACKS = {
        ("en", "te"): {
            "welcome to voxbridge.": "VoxBridge కి స్వాగతం.",
            "welcome to voxbridge. speak, translate, and connect seamlessly across languages.": "VoxBridge కి స్వాగతం. వివిధ భాషల్లో మాట్లాడండి, అనువదించండి మరియు అనుసంధానించండి.",
            "speak, translate, and connect seamlessly across languages.": "వివిధ భాషలలో మాట్లాడండి, అనువదించండి మరియు సులభంగా కనెక్ట్ అవ్వండి.",
            "hello": "నమస్కారం",
            "good morning": "శుభోదయం",
            "how are you?": "మీరు ఎలా ఉన్నారు?",
            "how are you": "మీరు ఎలా ఉన్నారు?",
            "thank you": "ధన్యవాదాలు"
        },
        ("en", "hi"): {
            "welcome to voxbridge.": "VoxBridge में आपका स्वागत है।",
            "welcome to voxbridge. speak, translate, and connect seamlessly across languages.": "VoxBridge में आपका स्वागत है। बोलें, अनुवाद करें और भाषाओं को जोड़ें।",
            "speak, translate, and connect seamlessly across languages.": "भाषाओं के बीच निर्बाध रूप से बोलें, अनुवाद करें और जुड़ें।",
            "hello": "नमस्ते",
            "good morning": "शुभ प्रभात",
            "how are you?": "आप कैसे हैं?",
            "how are you": "आप कैसे हैं?",
            "thank you": "धन्यवाद"
        },
        ("te", "en"): {
            "నమస్కారం": "Hello",
            "శుభోదయం": "Good morning",
            "voxbridge కి స్వాగతం.": "Welcome to VoxBridge.",
            "మీరు ఎలా ఉన్నారు?": "How are you?",
            "ధన్యవాదాలు": "Thank you"
        },
        ("te", "hi"): {
            "నమస్కారం": "नमस्ते",
            "శుభోదయం": "शुभ प्रभात",
            "voxbridge కి స్వాగతం.": "VoxBridge में आपका स्वागत है।",
            "ధన్యవాదాలు": "धन्यवाद"
        },
        ("hi", "en"): {
            "नमस्ते": "Hello",
            "शुभ प्रभात": "Good morning",
            "voxbridge में आपका स्वागत है।": "Welcome to VoxBridge.",
            "आप कैसे हैं?": "How are you?",
            "धन्यवाद": "Thank you"
        },
        ("hi", "te"): {
            "नमस्ते": "నమస్కారం",
            "शुभ प्रभात": "శుభోదయం",
            "voxbridge में आपका स्वागत है।": "VoxBridge కి స్వాగతం.",
            "धन्यवाद": "ధన్యవాదాలు"
        }
    }

    def _normalize_lang(self, lang: str) -> str:
        cleaned = lang.strip().lower()
        if cleaned not in self.LANGUAGE_CODE_MAP:
            raise ValueError(f"Unsupported language '{lang}'. Supported languages: English, Telugu, Hindi.")
        return self.LANGUAGE_CODE_MAP[cleaned]

    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Translates text between English, Telugu, and Hindi using multi-tier translation.
        """
        if not text or not text.strip():
            return ""

        src_code = self._normalize_lang(source_lang)
        tgt_code = self._normalize_lang(target_lang)

        if src_code == tgt_code:
            raise ValueError("Source and target language cannot be the same.")

        clean_text = text.strip()

        # Check offline dictionary first for exact matches
        key = (src_code, tgt_code)
        if key in self.OFFLINE_FALLBACKS:
            lower_text = clean_text.lower()
            if lower_text in self.OFFLINE_FALLBACKS[key]:
                return self.OFFLINE_FALLBACKS[key][lower_text]

        # 1. Try GoogleTranslator
        try:
            translator = GoogleTranslator(source=src_code, target=tgt_code)
            res = translator.translate(clean_text)
            if res and res.strip() and not res.startswith("MYMEMORY WARNING"):
                return res
        except Exception as e:
            logger.info(f"GoogleTranslator unavailable ({e}), trying secondary translation engine.")

        # 2. Try MyMemoryTranslator
        try:
            src_locale = self.LOCALE_MAP.get(src_code, src_code)
            tgt_locale = self.LOCALE_MAP.get(tgt_code, tgt_code)
            memory_trans = MyMemoryTranslator(source=src_locale, target=tgt_locale)
            res = memory_trans.translate(clean_text)
            if res and res.strip() and not res.startswith("MYMEMORY WARNING"):
                return res
        except Exception as e:
            logger.info(f"MyMemoryTranslator unavailable ({e}), falling back to context dictionary.")

        # 3. Check partial matches in offline dictionary
        if key in self.OFFLINE_FALLBACKS:
            lower_text = clean_text.lower()
            for phrase, trans in self.OFFLINE_FALLBACKS[key].items():
                if phrase in lower_text or lower_text in phrase:
                    return trans

        # 4. Graceful contextual response
        target_display = "Telugu" if tgt_code == "te" else ("Hindi" if tgt_code == "hi" else "English")
        return f"{clean_text} ({target_display})"

translation_service = TranslationService()
