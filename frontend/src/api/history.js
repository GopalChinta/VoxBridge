import api from './axios';

export const historyAPI = {
  getHistory: async ({ search = '', language = '', limit = 50, offset = 0 } = {}) => {
    const params = {};
    if (search) params.search = search;
    if (language && language !== 'All') params.language = language;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    const response = await api.get('/history', { params });
    return response.data;
  },

  getHistoryDetail: async (id) => {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },

  deleteHistory: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  }
};
