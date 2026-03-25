/**
 * Alert Model
 * Database operations for alert management
 */

const { query } = require('../config/db');

/**
 * Create a new alert
 * @param {Object} alertData - Alert data
 * @returns {Object} Created alert
 */
const createAlert = async ({ userId, type, message, aqi, severity }) => {
  const result = await query(
    `INSERT INTO alerts (user_id, type, message, aqi, severity, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING *`,
    [userId, type, message, aqi, severity]
  );
  return result.rows[0];
};

/**
 * Get alerts for a user
 * @param {number} userId - User ID
 * @param {number} limit - Maximum number of alerts
 * @returns {Array} List of alerts
 */
const getAlertsByUserId = async (userId, limit = 50) => {
  const result = await query(
    `SELECT * FROM alerts
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};

/**
 * Mark alert as read
 * @param {number} alertId - Alert ID
 * @param {number} userId - User ID (for security)
 * @returns {Object} Updated alert
 */
const markAlertAsRead = async (alertId, userId) => {
  const result = await query(
    `UPDATE alerts 
     SET read_at = NOW(), is_read = TRUE
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [alertId, userId]
  );
  return result.rows[0];
};

/**
 * Get unread alert count
 * @param {number} userId - User ID
 * @returns {number} Unread alert count
 */
const getUnreadAlertCount = async (userId) => {
  const result = await query(
    'SELECT COUNT(*) as count FROM alerts WHERE user_id = $1 AND is_read = FALSE',
    [userId]
  );
  return parseInt(result.rows[0].count);
};

/**
 * Delete old alerts (older than 30 days)
 * @param {number} userId - User ID
 * @returns {number} Number of deleted alerts
 */
const deleteOldAlerts = async (userId) => {
  const result = await query(
    `DELETE FROM alerts 
     WHERE user_id = $1 AND created_at < NOW() - INTERVAL '30 days'`,
    [userId]
  );
  return result.rowCount;
};

/**
 * Check if an alert was recently sent (within last hour)
 * @param {number} userId - User ID
 * @param {string} type - Alert type
 * @returns {boolean} Alert was recently sent
 */
const wasAlertRecentlySent = async (userId, type) => {
  const result = await query(
    `SELECT COUNT(*) as count 
     FROM alerts 
     WHERE user_id = $1 AND type = $2 AND created_at >= NOW() - INTERVAL '1 hour'`,
    [userId, type]
  );
  return parseInt(result.rows[0].count) > 0;
};

module.exports = {
  createAlert,
  getAlertsByUserId,
  markAlertAsRead,
  getUnreadAlertCount,
  deleteOldAlerts,
  wasAlertRecentlySent,
};
