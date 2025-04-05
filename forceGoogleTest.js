const fs = require('fs');
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

async function transcribe() {
  const file = fs.readFileSync('Recording (4).wav');
  const audioBytes = file.toString('base64');

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'ar',
      //alternativeLanguageCodes: ['ja-JP,es-es'],
      audioChannelCount: 2,
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  console.log('📝 Transcription:', transcription || '(empty)');
}

transcribe().catch(console.error);
