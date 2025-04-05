const mic = require('mic');
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

const encoding = 'LINEAR16';
const sampleRateHertz = 48000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    audioChannelCount: 1,
  },
  interimResults: false,
};


// Create the recognition stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', (err) => {
    console.error('❌ Google Speech error:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Details:', err.details || '(no details)');
  })
  .on('data', (data) => {
    console.log('📥 Received data from Google:');
    console.dir(data, { depth: null });

    const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;
    if (transcript) {
      console.log('📝 Transcription:', transcript);
    } else {
      console.log('⚠️ No transcript in this response.');
    }
  })
  .on('end', () => {
    console.log('📴 Google stream ended.');
  });


// Mic setup
const micInstance = mic({
  rate: '16000',
  channels: '1',
  bitwidth: 16,
  encoding: 'signed-integer',
  endian: 'little',
  debug: true,
  device: 'default',
  fileType: 'raw',
  sox: true, // <--- make SoX do the format conversion for us
});


const micInputStream = micInstance.getAudioStream();
const fs = require('fs');

// Save the raw mic input to a file for debugging
const debugOutput = fs.createWriteStream('debug.raw');
micInputStream.pipe(debugOutput);


micInputStream
  .on('error', (err) => {
    console.error('Mic input error:', err);
  })
  .on('data', (data) => {
    console.log(`🎧 Mic stream received ${data.length} bytes`);
  })
  .pipe(recognizeStream);

micInstance.start();

console.log('🎤 Listening... Press Ctrl+C to stop.');
