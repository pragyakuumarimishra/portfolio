/**
 * Sensor Data Processing Service
 * Processes incoming IoT sensor data
 */

const { getOrCreateSensor, updateSensorLastSeen } = require('../models/sensorModel');
const { saveReading } = require('../models/readingModel');
const { getOverallAQI, calculatePM25AQI } = require('../utils/aqiCalculator');
const { validateSensorData } = require('../utils/validators');
const alertService = require('./alertService');
const logger = require('../utils/logger');

/**
 * Process incoming sensor data
 * @param {number} userId - User ID
 * @param {Object} data - Sensor data
 * @returns {Object} Processed reading
 */
const processSensorData = async (userId, data) => {
  const { deviceId, pm25, pm10, co2, temperature, humidity } = data;

  // Validate data
  const validation = validateSensorData({ pm25, pm10, co2, temperature, humidity });
  if (!validation.isValid) {
    const error = new Error(`Invalid sensor data: ${validation.errors.join(', ')}`);
    error.status = 400;
    throw error;
  }

  // Get or create sensor
  const sensor = await getOrCreateSensor(userId, deviceId || 'default');

  // Calculate AQI
  const aqiResult = getOverallAQI({ pm25, pm10 });
  const aqi = aqiResult.aqi;

  // Save reading
  const reading = await saveReading({
    sensorId: sensor.id,
    userId,
    pm25,
    pm10,
    co2,
    temperature,
    humidity,
    aqi,
  });

  // Update sensor last seen
  await updateSensorLastSeen(sensor.id);

  // Check for alerts (non-blocking)
  alertService.checkAndSendAlerts(userId, aqi, reading).catch((err) =>
    logger.warn('Alert check failed', { userId, error: err.message })
  );

  logger.info('Sensor data processed', { userId, deviceId, aqi, sensorId: sensor.id });

  return { ...reading, aqi_category: aqiResult };
};

module.exports = { processSensorData };
