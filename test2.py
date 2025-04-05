from faster_whisper import WhisperModel
from transliterate import transliterate
audio_path = "Assets/AudioWav/japanese1.wav"

model = WhisperModel("base")
segments, _  + model.transcribe(audio_path, language="en")

for segment in segments:
    text = segment.text
    transliterated = translit(text, 'ja')
    