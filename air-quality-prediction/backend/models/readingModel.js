/**
 * Reading Model
 * Database operations for sensor readings
 */

const { query } = require('../config/db');

/**
 * Save a new sensor reading
 * @param {Object} readingData - Reading data
 * @returns {Object} Saved reading
 */
const saveReading = async ({ sensorId, userId, pm25, pm10, co2, temperature, humidity, aqi }) => {
  const result = await query(
    `INSERT INTO readings (sensor_id, user_id, pm25, pm10, co2, temperature, humidity, aqi, recorded_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING *`,
    [sensorId, userId, pm25, pm10 || null, co2 || null, temperature || null, humidity || null, aqi]
  );
  return result.rows[0];
};

/**
 * Get latest reading for a user
 * @param {number} userId - User ID
 * @returns {Object|null} Latest reading
 */
const getLatestReading = async (userId) => {
  const result = await query(
    `SELECT r.*, s.name as sensor_name, s.location
     FROM readings r
     JOIN sensors s ON r.sensor_id = s.id
     WHERE r.user_id = $1
     ORDER BY r.recorded_at DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0] || null;
};

/**
 * Get readings for a specified number of days
 * @param {number} userId - User ID
 * @param {number} days - Number of days to fetch
 * @returns {Array} List of readings
 */
const getReadingsByDays = async (userId, days) => {
  const result = await query(
    `SELECT r.*, s.name as sensor_name
     FROM readings r
     JOIN sensors s ON r.sensor_id = s.id
     WHERE r.user_id = $1
       AND r.recorded_at >= NOW() - INTERVAL '${parseInt(days)} days'
     ORDER BY r.recorded_at ASC`,
    [userId]
  );
  return result.rows;
};

/**
 * Get hourly average readings
 * @param {number} userId - User ID
 * @param {number} hours - Number of hours
 * @returns {Array} Hourly averages
 */
const getHourlyAverages = async (userId, hours = 24) => {
  const result = await query(
    `SELECT 
       DATE_TRUNC('hour', recorded_at) as hour,
       AVG(pm25)::NUMERIC(10,2) as avg_pm25,
       AVG(pm10)::NUMERIC(10,2) as avg_pm10,
       AVG(co2)::NUMERIC(10,2) as avg_co2,
       AVG(temperature)::NUMERIC(10,2) as avg_temperature,
       AVG(humidity)::NUMERIC(10,2) as avg_humidity,
       AVG(aqi)::NUMERIC(10,2) as avg_aqi,
       COUNT(*) as reading_count
     FROM readings
     WHERE user_id = $1
       AND recorded_at >= NOW() - INTERVAL '${parseInt(hours)} hours'
     GROUP BY DATE_TRUNC('hour', recorded_at)
     ORDER BY hour ASC`,
    [userId]
  );
  return result.rows;
};

/**
 * Get AQI statistics for a user
 * @param {number} userId - User ID
 * @param {number} days - Number of days
 * @returns {Object} Statistics
 */
const getAQIStats = async (userId, days = 7) => {
  const result = await query(
    `SELECT 
       AVG(aqi)::NUMERIC(10,2) as avg_aqi,
       MIN(aqi) as min_aqi,
       MAX(aqi) as max_aqi,
       AVG(pm25)::NUMERIC(10,2) as avg_pm25,
       AVG(pm10)::NUMERIC(10,2) as avg_pm10,
       AVG(co2)::NUMERIC(10,2) as avg_co2,
       COUNT(*) as total_readings
     FROM readings
     WHERE user_id = $1
       AND recorded_at >= NOW() - INTERVAL '${parseInt(days)} days'`,
    [userId]
  );
  return result.rows[0];
};

/**
 * Get recent readings for prediction model
 * @param {number} userId - User ID
 * @param {number} limit - Number of readings to fetch
 * @returns {Array} Recent readings
 */
const getRecentReadingsForPrediction = async (userId, limit = 24) => {
  const result = await query(
    `SELECT aqi, pm25, pm10, co2, temperature, humidity, recorded_at
     FROM readings
     WHERE user_id = $1
     ORDER BY recorded_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows.reverse(); // Return in chronological order
};

module.exports = {
  saveReading,
  getLatestReading,
  getReadingsByDays,
  getHourlyAverages,
  getAQIStats,
  getRecentReadingsForPrediction,
};
