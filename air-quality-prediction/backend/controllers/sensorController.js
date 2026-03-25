/**
 * Sensor Controller
 * Handles IoT sensor data HTTP requests
 */

const { processSensorData } = require('../services/sensorService');
const { getLatestReading, getReadingsByDays } = require('../models/readingModel');
const { findSensorsByUserId } = require('../models/sensorModel');

/**
 * POST /api/sensor/data
 * Submit new sensor reading
 */
const submitSensorData = async (req, res, next) => {
  try {
    const reading = await processSensorData(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: 'Sensor data recorded successfully',
      data: reading,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sensor/latest
 * Get latest sensor reading
 */
const getLatestSensorData = async (req, res, next) => {
  try {
    const reading = await getLatestReading(req.user.id);

    if (!reading) {
      return res.json({
        success: true,
        data: null,
        message: 'No readings available yet',
      });
    }

    res.json({
      success: true,
      data: reading,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sensor/readings/:days
 * Get historical sensor readings
 */
const getHistoricalReadings = async (req, res, next) => {
  try {
    const days = parseInt(req.params.days) || 7;
    const readings = await getReadingsByDays(req.user.id, days);

    res.json({
      success: true,
      data: readings,
      count: readings.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/sensor/devices
 * Get user's registered sensors
 */
const getUserSensors = async (req, res, next) => {
  try {
    const sensors = await findSensorsByUserId(req.user.id);

    res.json({
      success: true,
      data: sensors,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSensorData,
  getLatestSensorData,
  getHistoricalReadings,
  getUserSensors,
};
