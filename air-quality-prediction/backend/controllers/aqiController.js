/**
 * AQI Analytics Controller
 * Handles AQI analytics and statistics HTTP requests
 */

const {
  getCurrentAQI,
  getAQIStatistics,
  getAQITrend,
  getHistoricalData,
} = require('../services/aqiService');
const { generatePredictions } = require('../services/predictionService');

/**
 * GET /api/aqi/current
 * Get current indoor AQI
 */
const getCurrent = async (req, res, next) => {
  try {
    const data = await getCurrentAQI(req.user.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/aqi/stats
 * Get AQI statistics
 */
const getStats = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = await getAQIStatistics(req.user.id, days);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/aqi/trend
 * Get AQI trend data
 */
const getTrend = async (req, res, next) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const data = await getAQITrend(req.user.id, hours);

    res.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/aqi/history
 * Get historical AQI data
 */
const getHistory = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = await getHistoricalData(req.user.id, days);

    res.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/predictions
 * Get 6-hour AQI predictions
 */
const getPredictions = async (req, res, next) => {
  try {
    const data = await generatePredictions(req.user.id);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCurrent, getStats, getTrend, getHistory, getPredictions };
