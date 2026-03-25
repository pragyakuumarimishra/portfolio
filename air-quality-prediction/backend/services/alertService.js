/**
 * Alert Management Service
 * Handles AQI alerts and notifications
 */

const { createAlert, getAlertsByUserId, wasAlertRecentlySent } = require('../models/alertModel');
const { findUserById } = require('../models/userModel');
const { sendAQIAlert } = require('../utils/emailService');
const { getAQICategory } = require('../utils/aqiCalculator');
const { ALERT_SEVERITY } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Check conditions and send alerts if needed
 * @param {number} userId - User ID
 * @param {number} aqi - Current AQI value
 * @param {Object} reading - Current reading data
 */
const checkAndSendAlerts = async (userId, aqi, reading) => {
  try {
    const user = await findUserById(userId);

    if (!user || !user.alert_enabled) return;

    const threshold = user.alert_threshold || 100;

    if (aqi > threshold) {
      const alertType = `aqi_threshold_${Math.floor(aqi / 50) * 50}`;

      // Check if alert was recently sent (rate limiting)
      const recentlySent = await wasAlertRecentlySent(userId, alertType);
      if (recentlySent) return;

      const category = getAQICategory(aqi);
      const severity = getAlertSeverity(aqi);

      // Create alert record
      await createAlert({
        userId,
        type: alertType,
        message: `Air quality is ${category.label} (AQI: ${aqi}). ${category.cautionaryStatement}`,
        aqi,
        severity,
      });

      // Send email notification
      await sendAQIAlert(user.email, {
        aqi,
        category: category.label,
        location: reading.location || 'Indoor',
        timestamp: reading.recorded_at,
      });

      logger.info('Alert sent', { userId, aqi, severity });
    }
  } catch (error) {
    logger.error('Alert service error', { userId, error: error.message });
    throw error;
  }
};

/**
 * Get alerts for a user
 * @param {number} userId - User ID
 * @param {number} limit - Maximum number of alerts
 * @returns {Array} List of alerts
 */
const getUserAlerts = async (userId, limit = 50) => {
  return getAlertsByUserId(userId, limit);
};

/**
 * Get alert severity based on AQI
 * @param {number} aqi - AQI value
 * @returns {string} Severity level
 */
const getAlertSeverity = (aqi) => {
  if (aqi <= 100) return ALERT_SEVERITY.INFO;
  if (aqi <= 150) return ALERT_SEVERITY.WARNING;
  if (aqi <= 200) return ALERT_SEVERITY.DANGER;
  return ALERT_SEVERITY.CRITICAL;
};

module.exports = { checkAndSendAlerts, getUserAlerts, getAlertSeverity };
