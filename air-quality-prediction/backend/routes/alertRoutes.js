/**
 * Alert Management Routes
 */

const express = require('express');
const router = express.Router();
const { getAlerts, readAlert, clearOldAlerts } = require('../controllers/alertController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, getAlerts);
router.put('/:id/read', authenticate, readAlert);
router.delete('/old', authenticate, clearOldAlerts);

module.exports = router;
