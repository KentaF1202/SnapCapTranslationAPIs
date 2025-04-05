const WebSocket = require('ws');
const speech = require('@google-cloud/speech');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', socket => {
  const client = new speech.SpeechClient();

  const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
      interimResults: true,
    },
    interimResults: true,
  };

  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      const transcript = data.results[0].alternatives[0].transcript;
      const isFinal = data.results[0].isFinal;
      socket.send(JSON.stringify({ transcript, isFinal }));
    });

  socket.on('message', (audioChunk) => {
    recognizeStream.write(audioChunk);
  });

  socket.on('close', () => {
    recognizeStream.destroy();
  });
});
