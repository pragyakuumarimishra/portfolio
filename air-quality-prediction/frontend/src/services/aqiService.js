import api from './authService';

export const aqiService = {
  getCurrent: async () => {
    const response = await api.get('/aqi/current');
    return response.data;
  },

  getStats: async (days = 7) => {
    const response = await api.get(`/aqi/stats?days=${days}`);
    return response.data;
  },

  getTrend: async (hours = 24) => {
    const response = await api.get(`/aqi/trend?hours=${hours}`);
    return response.data;
  },

  getHistory: async (days = 7) => {
    const response = await api.get(`/aqi/history?days=${days}`);
    return response.data;
  },

  getPredictions: async () => {
    const response = await api.get('/predictions');
    return response.data;
  },

  getAlerts: async (limit = 50) => {
    const response = await api.get(`/alerts?limit=${limit}`);
    return response.data;
  },

  markAlertRead: async (id) => {
    const response = await api.put(`/alerts/${id}/read`);
    return response.data;
  },
};
