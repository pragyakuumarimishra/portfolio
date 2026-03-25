/**
 * AQI Analytics Routes
 */

const express = require('express');
const router = express.Router();
const { getCurrent, getStats, getTrend, getHistory, getPredictions } = require('../controllers/aqiController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/current', authenticate, getCurrent);
router.get('/stats', authenticate, getStats);
router.get('/trend', authenticate, getTrend);
router.get('/history', authenticate, getHistory);

module.exports = router;
