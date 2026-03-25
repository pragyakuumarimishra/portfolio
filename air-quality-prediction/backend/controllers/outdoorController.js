/**
 * Outdoor AQI Controller
 * Handles outdoor air quality HTTP requests
 */

const { getOutdoorAQI, getMultipleCitiesAQI } = require('../services/outdoorService');

// Default cities to monitor
const DEFAULT_CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];

/**
 * GET /api/outdoor/:city
 * Get outdoor AQI for a specific city
 */
const getCityAQI = async (req, res, next) => {
  try {
    const { city } = req.params;
    const data = await getOutdoorAQI(city);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/outdoor
 * Get outdoor AQI for multiple default cities
 */
const getMultipleCities = async (req, res, next) => {
  try {
    const cities = req.query.cities
      ? req.query.cities.split(',').map((c) => c.trim())
      : DEFAULT_CITIES;

    const data = await getMultipleCitiesAQI(cities);

    res.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCityAQI, getMultipleCities };
