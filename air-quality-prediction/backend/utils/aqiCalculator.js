/**
 * EPA AQI Calculator Utility
 * Calculates Air Quality Index based on EPA standards
 */

const { PM25_BREAKPOINTS, PM10_BREAKPOINTS, AQI_CATEGORIES } = require('../config/constants');

/**
 * Calculate AQI from concentration using EPA formula
 * AQI = ((IHigh - ILow) / (CHigh - CLow)) * (C - CLow) + ILow
 *
 * @param {number} concentration - Pollutant concentration
 * @param {Array} breakpoints - Breakpoint table for the pollutant
 * @returns {number} AQI value
 */
const calculateAQI = (concentration, breakpoints) => {
  if (concentration < 0) return 0;

  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      const aqi =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow;
      return Math.round(aqi);
    }
  }

  // If concentration exceeds all breakpoints, return max AQI
  return 500;
};

/**
 * Calculate PM2.5 AQI
 * @param {number} pm25 - PM2.5 concentration in µg/m³
 * @returns {number} AQI value
 */
const calculatePM25AQI = (pm25) => {
  // Truncate to 1 decimal place as per EPA guidelines
  const truncated = Math.floor(pm25 * 10) / 10;
  return calculateAQI(truncated, PM25_BREAKPOINTS);
};

/**
 * Calculate PM10 AQI
 * @param {number} pm10 - PM10 concentration in µg/m³
 * @returns {number} AQI value
 */
const calculatePM10AQI = (pm10) => {
  // Truncate to integer as per EPA guidelines
  const truncated = Math.floor(pm10);
  return calculateAQI(truncated, PM10_BREAKPOINTS);
};

/**
 * Get the overall AQI (highest of all pollutants)
 * @param {Object} pollutants - Object with pollutant concentrations
 * @returns {Object} Overall AQI and contributing pollutant
 */
const getOverallAQI = (pollutants) => {
  const aqiValues = [];

  if (pollutants.pm25 !== undefined && pollutants.pm25 !== null) {
    aqiValues.push({ pollutant: 'PM2.5', aqi: calculatePM25AQI(pollutants.pm25) });
  }

  if (pollutants.pm10 !== undefined && pollutants.pm10 !== null) {
    aqiValues.push({ pollutant: 'PM10', aqi: calculatePM10AQI(pollutants.pm10) });
  }

  if (aqiValues.length === 0) return { aqi: 0, pollutant: 'Unknown' };

  // Return the highest AQI value
  return aqiValues.reduce((max, current) => (current.aqi > max.aqi ? current : max));
};

/**
 * Get AQI category based on AQI value
 * @param {number} aqi - AQI value
 * @returns {Object} Category information
 */
const getAQICategory = (aqi) => {
  for (const [key, category] of Object.entries(AQI_CATEGORIES)) {
    if (aqi >= category.range[0] && aqi <= category.range[1]) {
      return { key, ...category };
    }
  }
  return { key: 'HAZARDOUS', ...AQI_CATEGORIES.HAZARDOUS };
};

/**
 * Get health recommendation based on AQI
 * @param {number} aqi - AQI value
 * @returns {Object} Health recommendations
 */
const getHealthRecommendations = (aqi) => {
  const category = getAQICategory(aqi);

  const recommendations = {
    general: category.cautionaryStatement,
    sensitive: '',
    outdoor: '',
    indoor: '',
  };

  if (aqi <= 50) {
    recommendations.outdoor = 'Enjoy outdoor activities freely.';
    recommendations.indoor = 'Normal ventilation is fine.';
    recommendations.sensitive = 'No special precautions needed.';
  } else if (aqi <= 100) {
    recommendations.outdoor = 'Sensitive individuals should limit prolonged outdoor exertion.';
    recommendations.indoor = 'Consider reducing ventilation if sensitive.';
    recommendations.sensitive = 'Monitor for symptoms and reduce exposure if needed.';
  } else if (aqi <= 150) {
    recommendations.outdoor = 'Sensitive groups should limit outdoor activities.';
    recommendations.indoor = 'Use air purifiers indoors.';
    recommendations.sensitive = 'Wear N95 mask outdoors.';
  } else if (aqi <= 200) {
    recommendations.outdoor = 'Everyone should limit outdoor activities.';
    recommendations.indoor = 'Keep windows closed, use air purifiers.';
    recommendations.sensitive = 'Stay indoors as much as possible.';
  } else if (aqi <= 300) {
    recommendations.outdoor = 'Everyone should avoid prolonged outdoor exertion.';
    recommendations.indoor = 'Seal gaps in windows/doors, use air purifiers on high.';
    recommendations.sensitive = 'Do not go outside unless absolutely necessary.';
  } else {
    recommendations.outdoor = 'Everyone should avoid all outdoor exertion.';
    recommendations.indoor = 'Stay indoors with air purification running continuously.';
    recommendations.sensitive = 'Seek medical attention if symptoms develop.';
  }

  return recommendations;
};

module.exports = {
  calculatePM25AQI,
  calculatePM10AQI,
  getOverallAQI,
  getAQICategory,
  getHealthRecommendations,
};
