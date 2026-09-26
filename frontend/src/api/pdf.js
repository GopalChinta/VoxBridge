import api from './axios';

export const pdfAPI = {
  generatePDF: async ({
    record_id = null,
    original_text = '',
    detected_language = '',
    source_language = '',
    target_language = '',
    translation = ''
  }) => {
    const response = await api.post('/pdf/generate', {
      record_id,
      original_text,
      detected_language,
      source_language,
      target_language,
      translation
    });
    return response.data;
  }
};
