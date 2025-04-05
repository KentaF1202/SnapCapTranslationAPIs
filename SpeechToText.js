const fs = require('fs');
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

async function transcribe(wav) {
  const file = fs.readFileSync(wav+'.wav'); //File to be read
  const audioBytes = file.toString('base64');

  
  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000, //Hz of file
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

transcribe("Recording (4)").catch(console.error);
