// master.js
const { transcribe } = require('./speechToText');
const { translate } = require('./translateText');

async function run() {
  const audioFileName = 'english1';
  const transcription = await transcribe(audioFileName);
  console.log('📝 Transcribed:', transcription);

  const translated = await translate(transcription, 'es'); // Spanish
  console.log('🌐 Translated:', translated);
}

run().catch(console.error);
