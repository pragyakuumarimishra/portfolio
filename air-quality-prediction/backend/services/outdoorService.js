/**
 * Outdoor AQI Service
 * Integrates with OpenAQ API for outdoor air quality data
 */

const axios = require('axios');
const logger = require('../utils/logger');

const OPENAQ_BASE_URL = process.env.OPENAQ_API_URL || 'https://api.openaq.org/v2';

// Cache outdoor data to reduce API calls
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Get outdoor AQI data for a city
 * @param {string} city - City name
 * @returns {Object} Outdoor AQI data
 */
const getOutdoorAQI = async (city) => {
  const cacheKey = city.toLowerCase();
  const cached = cache.get(cacheKey);

  // Return cached data if fresh
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    logger.debug('Returning cached outdoor AQI', { city });
    return cached.data;
  }

  try {
    const response = await axios.get(`${OPENAQ_BASE_URL}/latest`, {
      params: {
        city,
        parameter: 'pm25',
        limit: 10,
        order_by: 'lastUpdated',
        sort: 'desc',
      },
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      },
    });

    const results = response.data.results || [];

    if (results.length === 0) {
      return {
        city,
        available: false,
        message: 'No data available for this city',
      };
    }

    // Process and aggregate results
    const pm25Values = results
      .flatMap((station) => station.measurements || [])
      .filter((m) => m.parameter === 'pm25' && m.value >= 0)
      .map((m) => m.value);

    if (pm25Values.length === 0) {
      return { city, available: false, message: 'No PM2.5 data available' };
    }

    const avgPM25 = pm25Values.reduce((sum, v) => sum + v, 0) / pm25Values.length;
    const { calculatePM25AQI, getAQICategory } = require('../utils/aqiCalculator');
    const aqi = calculatePM25AQI(avgPM25);
    const category = getAQICategory(aqi);

    const data = {
      city,
      available: true,
      aqi,
      pm25: Math.round(avgPM25 * 10) / 10,
      category: category.label,
      color: category.color,
      stations: results.length,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the result
    cache.set(cacheKey, { data, timestamp: Date.now() });

    logger.info('Outdoor AQI fetched', { city, aqi });
    return data;
  } catch (error) {
    logger.error('Failed to fetch outdoor AQI', { city, error: error.message });

    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return getMockOutdoorData(city);
    }

    throw new Error(`Failed to fetch outdoor AQI for ${city}: ${error.message}`);
  }
};

/**
 * Get mock outdoor data for development
 * @param {string} city - City name
 * @returns {Object} Mock data
 */
const getMockOutdoorData = (city) => {
  const aqi = Math.floor(Math.random() * 150) + 10;
  const { getAQICategory } = require('../utils/aqiCalculator');
  const category = getAQICategory(aqi);

  return {
    city,
    available: true,
    aqi,
    pm25: Math.round((aqi * 0.4) * 10) / 10,
    category: category.label,
    color: category.color,
    stations: 3,
    lastUpdated: new Date().toISOString(),
    mock: true,
  };
};

/**
 * Get multiple cities outdoor AQI
 * @param {Array} cities - Array of city names
 * @returns {Array} Array of AQI data
 */
const getMultipleCitiesAQI = async (cities) => {
  const results = await Promise.allSettled(cities.map((city) => getOutdoorAQI(city)));

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      city: cities[index],
      available: false,
      message: 'Failed to fetch data',
    };
  });
};

module.exports = { getOutdoorAQI, getMultipleCitiesAQI };
