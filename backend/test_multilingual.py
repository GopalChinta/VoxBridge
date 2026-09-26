import requests
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE = 'http://127.0.0.1:8000/api'
login_res = requests.post(f'{BASE}/auth/login', json={'email':'tester@voxbridge.ai','password':'SecurePassword2026!'})
token = login_res.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

pairs = [
  ('English', 'Telugu', 'Good morning'),
  ('English', 'Hindi', 'Good morning'),
  ('Telugu', 'English', 'నమస్కారం'),
  ('Telugu', 'Hindi', 'నమస్కారం'),
  ('Hindi', 'English', 'नमस्ते'),
  ('Hindi', 'Telugu', 'नमस्ते')
]

print("=== MULTILINGUAL TRANSLATION TEST ===")
for src, tgt, text in pairs:
    res = requests.post(f'{BASE}/translation/translate', headers=headers, json={'text': text, 'source_language': src, 'target_language': tgt})
    assert res.status_code == 200, f"Translation failed for {src}->{tgt}: {res.text}"
    trans = res.json().get('translation')
    print(f"[{src} -> {tgt}] '{text}' => '{trans}'")

print("\n=== MULTILINGUAL TTS GENERATION TEST ===")
tts_samples = [
    ('English', 'Welcome to VoxBridge'),
    ('Telugu', 'VoxBridge కి స్వాగతం'),
    ('Hindi', 'VoxBridge में आपका स्वागत है')
]

for lang, text in tts_samples:
    res = requests.post(f'{BASE}/tts/generate', headers=headers, json={'text': text, 'language': lang})
    assert res.status_code == 200, f"TTS failed for {lang}: {res.text}"
    audio_url = res.json().get('audio_url')
    print(f"[{lang} TTS] Generated: {audio_url}")

print("\nALL MULTILINGUAL TESTS PASSED SUCCESSFULLY!")
