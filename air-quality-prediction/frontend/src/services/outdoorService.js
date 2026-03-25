import api from './authService';

export const outdoorService = {
  getCityAQI: async (city) => {
    const response = await api.get(`/outdoor/${city}`);
    return response.data;
  },

  getMultipleCities: async (cities) => {
    const params = cities ? `?cities=${cities.join(',')}` : '';
    const response = await api.get(`/outdoor${params}`);
    return response.data;
  },
};
