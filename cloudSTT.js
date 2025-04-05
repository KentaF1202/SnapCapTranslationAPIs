const mic = require('mic');
const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient();

const encoding = 'LINEAR16';
const sampleRateHertz = 48000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    audioChannelCount: 1, // ✅ Telling Google it's mono
  },
  interimResults: true, // ✅ Smoother streaming experience
};

// 🎙️ Mic config — SoX will downmix stereo to mono internally
const micInstance = mic({
  rate: String(sampleRateHertz),
  channels: '1',                 // ✅ Force mono
  bitwidth: 16,
  encoding: 'signed-integer',
  endian: 'little',
  debug: true,
  device: 'default',
  fileType: 'raw',
  sox: true                      // ✅ Let SoX handle the channel conversion
});

const micInputStream = micInstance.getAudioStream();

// Optional: write raw mic data for debugging
const debugOutput = fs.createWriteStream('debug.raw');
micInputStream.pipe(debugOutput);

// 🎧 Handle mic stream
micInputStream
  .on('error', (err) => {
    console.error('Mic input error:', err);
  })
  .on('data', (data) => {
    console.log(`🎧 Mic stream received ${data.length} bytes`);
  })
  .pipe(
    client
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
      })
  );

micInstance.start();

console.log('🎤 Listening... Press Ctrl+C to stop.');
