/**
 * AQI Analytics Service
 * Provides AQI calculations, trends, and statistics
 */

const {
  getLatestReading,
  getHourlyAverages,
  getAQIStats,
  getReadingsByDays,
} = require('../models/readingModel');
const { getAQICategory, getHealthRecommendations } = require('../utils/aqiCalculator');
const logger = require('../utils/logger');

/**
 * Get current AQI data for a user
 * @param {number} userId - User ID
 * @returns {Object} Current AQI data
 */
const getCurrentAQI = async (userId) => {
  const reading = await getLatestReading(userId);

  if (!reading) {
    return {
      available: false,
      message: 'No sensor data available. Please connect your ESP32 sensor.',
    };
  }

  const category = getAQICategory(reading.aqi);
  const recommendations = getHealthRecommendations(reading.aqi);

  return {
    available: true,
    aqi: reading.aqi,
    pm25: reading.pm25,
    pm10: reading.pm10,
    co2: reading.co2,
    temperature: reading.temperature,
    humidity: reading.humidity,
    category: category.label,
    color: category.color,
    description: category.description,
    healthImplication: category.healthImplication,
    recommendations,
    sensorName: reading.sensor_name,
    location: reading.location,
    recordedAt: reading.recorded_at,
  };
};

/**
 * Get AQI statistics for a user
 * @param {number} userId - User ID
 * @param {number} days - Number of days
 * @returns {Object} AQI statistics
 */
const getAQIStatistics = async (userId, days = 7) => {
  const stats = await getAQIStats(userId, days);

  if (!stats || !stats.total_readings || stats.total_readings === '0') {
    return { available: false, message: 'No data available for the specified period' };
  }

  const avgCategory = getAQICategory(parseFloat(stats.avg_aqi));

  return {
    available: true,
    period: `${days} days`,
    avgAQI: parseFloat(stats.avg_aqi),
    minAQI: parseInt(stats.min_aqi),
    maxAQI: parseInt(stats.max_aqi),
    avgCategory: avgCategory.label,
    avgPM25: parseFloat(stats.avg_pm25),
    avgPM10: parseFloat(stats.avg_pm10),
    avgCO2: parseFloat(stats.avg_co2),
    totalReadings: parseInt(stats.total_readings),
  };
};

/**
 * Get AQI trend data
 * @param {number} userId - User ID
 * @param {number} hours - Number of hours
 * @returns {Array} Trend data
 */
const getAQITrend = async (userId, hours = 24) => {
  const hourlyData = await getHourlyAverages(userId, hours);

  return hourlyData.map((row) => ({
    hour: row.hour,
    aqi: parseFloat(row.avg_aqi),
    pm25: parseFloat(row.avg_pm25),
    pm10: parseFloat(row.avg_pm10),
    co2: parseFloat(row.avg_co2),
    temperature: parseFloat(row.avg_temperature),
    humidity: parseFloat(row.avg_humidity),
    readingCount: parseInt(row.reading_count),
  }));
};

/**
 * Get historical readings
 * @param {number} userId - User ID
 * @param {number} days - Number of days
 * @returns {Array} Historical readings
 */
const getHistoricalData = async (userId, days = 7) => {
  const readings = await getReadingsByDays(userId, days);

  return readings.map((reading) => {
    const category = getAQICategory(reading.aqi);
    return {
      id: reading.id,
      aqi: reading.aqi,
      pm25: reading.pm25,
      pm10: reading.pm10,
      co2: reading.co2,
      temperature: reading.temperature,
      humidity: reading.humidity,
      category: category.label,
      color: category.color,
      sensorName: reading.sensor_name,
      recordedAt: reading.recorded_at,
    };
  });
};

module.exports = {
  getCurrentAQI,
  getAQIStatistics,
  getAQITrend,
  getHistoricalData,
};
