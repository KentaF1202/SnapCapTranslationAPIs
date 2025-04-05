// TranslateText.js
const { TranslationServiceClient } = require('@google-cloud/translate').v3;

const client = new TranslationServiceClient();

async function translate(text, targetLanguage = 'es') {
  const request = {
    parent: `projects/YOUR_PROJECT_ID/locations/global`,
    contents: [text],
    mimeType: 'text/plain',
    sourceLanguageCode: 'en',
    targetLanguageCode: targetLanguage,
  };

  const [response] = await client.translateText(request);
  return response.translations[0].translatedText;
}

module.exports = { translate };
