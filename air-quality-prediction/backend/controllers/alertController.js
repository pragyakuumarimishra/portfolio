/**
 * Alert Controller
 * Handles alert management HTTP requests
 */

const { getUserAlerts } = require('../services/alertService');
const { markAlertAsRead, getUnreadAlertCount, deleteOldAlerts } = require('../models/alertModel');

/**
 * GET /api/alerts
 * Get user's alerts
 */
const getAlerts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const alerts = await getUserAlerts(req.user.id, limit);
    const unreadCount = await getUnreadAlertCount(req.user.id);

    res.json({
      success: true,
      data: alerts,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/alerts/:id/read
 * Mark alert as read
 */
const readAlert = async (req, res, next) => {
  try {
    const alertId = parseInt(req.params.id);
    const alert = await markAlertAsRead(alertId, req.user.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    res.json({
      success: true,
      message: 'Alert marked as read',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/alerts/old
 * Delete old alerts (30+ days)
 */
const clearOldAlerts = async (req, res, next) => {
  try {
    const deleted = await deleteOldAlerts(req.user.id);

    res.json({
      success: true,
      message: `Deleted ${deleted} old alerts`,
      deleted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAlerts, readAlert, clearOldAlerts };
