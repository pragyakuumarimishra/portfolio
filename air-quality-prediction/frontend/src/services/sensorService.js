import api from './authService';

export const sensorService = {
  submitData: async (data) => {
    const response = await api.post('/sensor/data', data);
    return response.data;
  },

  getLatest: async () => {
    const response = await api.get('/sensor/latest');
    return response.data;
  },

  getReadings: async (days = 7) => {
    const response = await api.get(`/sensor/readings/${days}`);
    return response.data;
  },

  getDevices: async () => {
    const response = await api.get('/sensor/devices');
    return response.data;
  },
};
