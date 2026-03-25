/**
 * Rate Limiting Middleware
 * Protects API from abuse
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
    res.status(429).json(options.message);
  },
});

// Strict rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn('Auth rate limit exceeded', { ip: req.ip, email: req.body?.email });
    res.status(429).json(options.message);
  },
});

// Sensor data rate limiter (IoT devices)
const sensorLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 readings per minute (1 per second)
  message: {
    success: false,
    message: 'Sensor data rate limit exceeded. Max 1 reading per second.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, sensorLimiter };
