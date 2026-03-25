/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, updateProfile, updateSettings } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/settings', authenticate, updateSettings);

module.exports = router;
