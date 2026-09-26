import requests
import sys

# Configure UTF-8 encoding for console printing of Indic scripts
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"


def test_full_pipeline():
    print("1. Testing Registration...")
    reg_data = {
        "name": "VoxBridge Tester",
        "email": "tester@voxbridge.ai",
        "password": "SecurePassword2026!"
    }
    r = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    if r.status_code == 400: # Already registered
        print("  User already registered, logging in...")
    else:
        assert r.status_code == 201, f"Register failed: {r.text}"
        print("  Registration successful!")

    print("2. Testing Login...")
    login_data = {
        "email": "tester@voxbridge.ai",
        "password": "SecurePassword2026!"
    }
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    assert r.status_code == 200, f"Login failed: {r.text}"
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("  Login successful! Token acquired.")

    print("3. Testing /auth/me...")
    r = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    assert r.status_code == 200
    user = r.json()
    print(f"  Authenticated as: {user['name']} ({user['email']})")

    print("4. Testing Speech Transcription (Upload mock audio)...")
    # Create small dummy audio file for testing
    dummy_wav_content = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    files = {"file": ("sample_english.wav", dummy_wav_content, "audio/wav")}
    r = requests.post(f"{BASE_URL}/speech/transcribe", headers=headers, files=files)
    assert r.status_code == 200, f"Transcribe failed: {r.text}"
    speech_res = r.json()
    record_id = speech_res["record_id"]
    print(f"  Transcription result: '{speech_res['transcription']}'")
    print(f"  Detected language: '{speech_res['detected_language']}', Record ID: {record_id}")

    print("5. Testing Translation (English -> Telugu)...")
    trans_data = {
        "text": speech_res["transcription"],
        "source_language": "English",
        "target_language": "Telugu",
        "record_id": record_id
    }
    r = requests.post(f"{BASE_URL}/translation/translate", headers=headers, json=trans_data)
    assert r.status_code == 200, f"Translate failed: {r.text}"
    trans_res = r.json()
    print(f"  Translated text: '{trans_res['translation']}'")

    print("6. Testing Text-to-Speech Generation...")
    tts_data = {
        "text": trans_res["translation"],
        "language": "Telugu",
        "record_id": record_id
    }
    r = requests.post(f"{BASE_URL}/tts/generate", headers=headers, json=tts_data)
    assert r.status_code == 200, f"TTS failed: {r.text}"
    tts_res = r.json()
    print(f"  TTS generated URL: {tts_res['audio_url']}")

    print("7. Testing PDF Generation...")
    pdf_data = {
        "record_id": record_id,
        "original_text": speech_res["transcription"],
        "detected_language": speech_res["detected_language"],
        "source_language": "English",
        "target_language": "Telugu",
        "translation": trans_res["translation"]
    }
    r = requests.post(f"{BASE_URL}/pdf/generate", headers=headers, json=pdf_data)
    assert r.status_code == 200, f"PDF failed: {r.text}"
    pdf_res = r.json()
    print(f"  PDF generated URL: {pdf_res['pdf_url']}")

    print("8. Testing History Retrieval...")
    r = requests.get(f"{BASE_URL}/history", headers=headers)
    assert r.status_code == 200, f"History failed: {r.text}"
    hist = r.json()
    assert hist["total"] >= 1, "Expected at least 1 record"
    print(f"  Retrieved {hist['total']} history item(s).")
    print("ALL BACKEND PIPELINE TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_full_pipeline()
