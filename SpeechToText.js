// SpeechToText.js
const fs = require('fs');
const speech = require('@google-cloud/speech');
const path = require('path');

const client = new speech.SpeechClient();

async function transcribe(filename) {
  const filePath = path.join(__dirname, 'Assets', 'AudioWav', `${filename}.wav`);
  const audioBytes = fs.readFileSync(filePath).toString('base64');

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
    },
  };

  const [response] = await client.recognize(request);
  return response.results.map(r => r.alternatives[0].transcript).join('\n');
}

module.exports = { transcribe };
