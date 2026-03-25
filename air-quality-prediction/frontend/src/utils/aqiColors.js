/**
 * AQI Color Mapping Utilities
 */

export const AQI_COLORS = {
  good: { bg: '#00e400', text: '#000', label: 'Good', range: [0, 50] },
  moderate: { bg: '#ffff00', text: '#000', label: 'Moderate', range: [51, 100] },
  sensitive: { bg: '#ff7e00', text: '#fff', label: 'Unhealthy for Sensitive Groups', range: [101, 150] },
  unhealthy: { bg: '#ff0000', text: '#fff', label: 'Unhealthy', range: [151, 200] },
  veryUnhealthy: { bg: '#8f3f97', text: '#fff', label: 'Very Unhealthy', range: [201, 300] },
  hazardous: { bg: '#7e0023', text: '#fff', label: 'Hazardous', range: [301, 500] },
};

/**
 * Get AQI color based on value
 * @param {number} aqi - AQI value
 * @returns {Object} Color information
 */
export const getAQIColor = (aqi) => {
  if (aqi <= 50) return AQI_COLORS.good;
  if (aqi <= 100) return AQI_COLORS.moderate;
  if (aqi <= 150) return AQI_COLORS.sensitive;
  if (aqi <= 200) return AQI_COLORS.unhealthy;
  if (aqi <= 300) return AQI_COLORS.veryUnhealthy;
  return AQI_COLORS.hazardous;
};

/**
 * Get AQI background color string
 * @param {number} aqi - AQI value
 * @returns {string} Hex color
 */
export const getAQIBgColor = (aqi) => {
  return getAQIColor(aqi).bg;
};

/**
 * Get Tailwind CSS class for AQI badge
 * @param {number} aqi - AQI value
 * @returns {string} Tailwind class
 */
export const getAQIBadgeClass = (aqi) => {
  if (aqi <= 50) return 'bg-green-500 text-black';
  if (aqi <= 100) return 'bg-yellow-400 text-black';
  if (aqi <= 150) return 'bg-orange-500 text-white';
  if (aqi <= 200) return 'bg-red-600 text-white';
  if (aqi <= 300) return 'bg-purple-700 text-white';
  return 'bg-red-900 text-white';
};
