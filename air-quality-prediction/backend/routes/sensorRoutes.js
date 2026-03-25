/**
 * Sensor Data Routes
 */

const express = require('express');
const router = express.Router();
const {
  submitSensorData,
  getLatestSensorData,
  getHistoricalReadings,
  getUserSensors,
} = require('../controllers/sensorController');
const { authenticate } = require('../middleware/authMiddleware');
const { sensorDataValidation, daysValidation } = require('../middleware/validateMiddleware');
const { sensorLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/data', authenticate, sensorLimiter, sensorDataValidation, submitSensorData);
router.get('/latest', authenticate, getLatestSensorData);
router.get('/readings/:days', authenticate, daysValidation, getHistoricalReadings);
router.get('/devices', authenticate, getUserSensors);

module.exports = router;
