/**
 * AQI Constants and Categories
 * Based on US EPA AQI standards
 */

const AQI_CATEGORIES = {
  GOOD: {
    range: [0, 50],
    label: 'Good',
    color: '#00e400',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    healthImplication: 'None',
    cautionaryStatement: 'None',
  },
  MODERATE: {
    range: [51, 100],
    label: 'Moderate',
    color: '#ffff00',
    description: 'Air quality is acceptable. However, there may be a risk for some people.',
    healthImplication: 'Unusually sensitive individuals may experience respiratory symptoms.',
    cautionaryStatement: 'Unusually sensitive people should consider reducing prolonged or heavy exertion.',
  },
  UNHEALTHY_SENSITIVE: {
    range: [101, 150],
    label: 'Unhealthy for Sensitive Groups',
    color: '#ff7e00',
    description: 'Members of sensitive groups may experience health effects.',
    healthImplication: 'Sensitive groups may experience health effects.',
    cautionaryStatement: 'Sensitive groups should reduce prolonged or heavy outdoor exertion.',
  },
  UNHEALTHY: {
    range: [151, 200],
    label: 'Unhealthy',
    color: '#ff0000',
    description: 'Some members of the general public may experience health effects.',
    healthImplication: 'Everyone may begin to experience health effects.',
    cautionaryStatement: 'Everyone should reduce prolonged or heavy outdoor exertion.',
  },
  VERY_UNHEALTHY: {
    range: [201, 300],
    label: 'Very Unhealthy',
    color: '#8f3f97',
    description: 'Health alert: The risk of health effects is increased for everyone.',
    healthImplication: 'Health alert: everyone may experience more serious health effects.',
    cautionaryStatement: 'Everyone should avoid prolonged or heavy outdoor exertion.',
  },
  HAZARDOUS: {
    range: [301, 500],
    label: 'Hazardous',
    color: '#7e0023',
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
    healthImplication: 'Health warnings of emergency conditions.',
    cautionaryStatement: 'Everyone should avoid all outdoor exertion.',
  },
};

// PM2.5 breakpoints (µg/m³) for AQI calculation
const PM25_BREAKPOINTS = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
  { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
];

// PM10 breakpoints (µg/m³)
const PM10_BREAKPOINTS = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 504, iLow: 301, iHigh: 400 },
  { cLow: 505, cHigh: 604, iLow: 401, iHigh: 500 },
];

// CO2 safe levels (ppm)
const CO2_LEVELS = {
  FRESH_AIR: { max: 400, label: 'Fresh Air' },
  ACCEPTABLE: { max: 600, label: 'Acceptable' },
  COMPLAINTS: { max: 1000, label: 'Complaints possible' },
  STUFFY: { max: 2500, label: 'Stuffy and stale' },
  DANGEROUS: { max: 5000, label: 'Dangerous levels' },
};

// Alert severity levels
const ALERT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger',
  CRITICAL: 'critical',
};

// Sensor data validity ranges
const SENSOR_RANGES = {
  pm25: { min: 0, max: 500 },
  pm10: { min: 0, max: 600 },
  co2: { min: 300, max: 5000 },
  temperature: { min: -40, max: 85 },
  humidity: { min: 0, max: 100 },
};

module.exports = {
  AQI_CATEGORIES,
  PM25_BREAKPOINTS,
  PM10_BREAKPOINTS,
  CO2_LEVELS,
  ALERT_SEVERITY,
  SENSOR_RANGES,
};
