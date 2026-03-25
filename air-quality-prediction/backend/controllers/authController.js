/**
 * Authentication Controller
 * Handles auth-related HTTP requests
 */

const { register, login } = require('../services/authService');
const { updateAlertSettings, updateUserProfile } = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * POST /api/auth/register
 * Register a new user
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await register({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Login user and return JWT
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/profile
 * Get current user profile
 */
const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};

/**
 * PUT /api/auth/profile
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await updateUserProfile(req.user.id, { name });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/auth/settings
 * Update alert settings
 */
const updateSettings = async (req, res, next) => {
  try {
    const { alertEnabled, alertThreshold } = req.body;
    const user = await updateAlertSettings(req.user.id, {
      alertEnabled,
      alertThreshold,
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, updateSettings };
