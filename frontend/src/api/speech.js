import api from './axios';

export const speechAPI = {
  transcribeAudio: async (audioBlobOrFile, filename = 'recording.webm') => {
    const formData = new FormData();
    formData.append('file', audioBlobOrFile, filename);

    const response = await api.post('/speech/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadAudio: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/speech/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
