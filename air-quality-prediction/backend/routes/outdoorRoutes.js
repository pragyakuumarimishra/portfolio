/**
 * Outdoor AQI Routes
 */

const express = require('express');
const router = express.Router();
const { getCityAQI, getMultipleCities } = require('../controllers/outdoorController');
const { authenticate } = require('../middleware/authMiddleware');
const { cityValidation } = require('../middleware/validateMiddleware');

router.get('/', authenticate, getMultipleCities);
router.get('/:city', authenticate, cityValidation, getCityAQI);

module.exports = router;
