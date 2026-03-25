/**
 * JWT Authentication Middleware
 * Verifies JWT tokens on protected routes
 */

const { verifyToken } = require('../services/authService');
const { findUserById } = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * Authenticate JWT token middleware
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.warn('Authentication failed', { error: error.message });

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }

    return res.status(500).json({ success: false, message: 'Authentication error.' });
  }
};

module.exports = { authenticate };
