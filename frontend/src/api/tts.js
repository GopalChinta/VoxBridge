import api from './axios';

export const ttsAPI = {
  generateSpeech: async ({ text, language, record_id = null }) => {
    const response = await api.post('/tts/generate', {
      text,
      language,
      record_id
    });
    return response.data;
  }
};
