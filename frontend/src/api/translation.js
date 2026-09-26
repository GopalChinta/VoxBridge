import api from './axios';

export const translationAPI = {
  translate: async ({ text, source_language, target_language, record_id = null }) => {
    const response = await api.post('/translation/translate', {
      text,
      source_language,
      target_language,
      record_id
    });
    return response.data;
  }
};
