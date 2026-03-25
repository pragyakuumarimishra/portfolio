/**
 * Input Validators
 * Validation helper functions
 */

const { SENSOR_RANGES } = require('../config/constants');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate sensor reading data
 * @param {Object} data - Sensor data to validate
 * @returns {Object} Validation result
 */
const validateSensorData = (data) => {
  const errors = [];

  // Check required fields
  if (data.pm25 === undefined || data.pm25 === null) {
    errors.push('PM2.5 reading is required');
  } else if (data.pm25 < SENSOR_RANGES.pm25.min || data.pm25 > SENSOR_RANGES.pm25.max) {
    errors.push(`PM2.5 must be between ${SENSOR_RANGES.pm25.min} and ${SENSOR_RANGES.pm25.max} µg/m³`);
  }

  if (data.pm10 !== undefined && data.pm10 !== null) {
    if (data.pm10 < SENSOR_RANGES.pm10.min || data.pm10 > SENSOR_RANGES.pm10.max) {
      errors.push(`PM10 must be between ${SENSOR_RANGES.pm10.min} and ${SENSOR_RANGES.pm10.max} µg/m³`);
    }
  }

  if (data.co2 !== undefined && data.co2 !== null) {
    if (data.co2 < SENSOR_RANGES.co2.min || data.co2 > SENSOR_RANGES.co2.max) {
      errors.push(`CO2 must be between ${SENSOR_RANGES.co2.min} and ${SENSOR_RANGES.co2.max} ppm`);
    }
  }

  if (data.temperature !== undefined && data.temperature !== null) {
    if (
      data.temperature < SENSOR_RANGES.temperature.min ||
      data.temperature > SENSOR_RANGES.temperature.max
    ) {
      errors.push(
        `Temperature must be between ${SENSOR_RANGES.temperature.min} and ${SENSOR_RANGES.temperature.max} °C`
      );
    }
  }

  if (data.humidity !== undefined && data.humidity !== null) {
    if (data.humidity < SENSOR_RANGES.humidity.min || data.humidity > SENSOR_RANGES.humidity.max) {
      errors.push(
        `Humidity must be between ${SENSOR_RANGES.humidity.min} and ${SENSOR_RANGES.humidity.max} %`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize string input to prevent injection
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 255); // Limit length
};

module.exports = {
  isValidEmail,
  validatePassword,
  validateSensorData,
  sanitizeString,
};
