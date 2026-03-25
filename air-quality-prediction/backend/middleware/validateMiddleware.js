/**
 * Input Validation Middleware
 * Uses express-validator for request validation
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Process validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').trim().normalizeEmail().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Sensor data validation rules
const sensorDataValidation = [
  body('pm25')
    .isFloat({ min: 0, max: 500 })
    .withMessage('PM2.5 must be between 0 and 500 µg/m³'),
  body('pm10')
    .optional()
    .isFloat({ min: 0, max: 600 })
    .withMessage('PM10 must be between 0 and 600 µg/m³'),
  body('co2')
    .optional()
    .isFloat({ min: 300, max: 5000 })
    .withMessage('CO2 must be between 300 and 5000 ppm'),
  body('temperature')
    .optional()
    .isFloat({ min: -40, max: 85 })
    .withMessage('Temperature must be between -40 and 85 °C'),
  body('humidity')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Humidity must be between 0 and 100%'),
  handleValidationErrors,
];

// City parameter validation
const cityValidation = [
  param('city')
    .trim()
    .notEmpty()
    .withMessage('City name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City name must be 2-100 characters')
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage('City name can only contain letters, spaces, and hyphens'),
  handleValidationErrors,
];

// Days parameter validation
const daysValidation = [
  param('days')
    .isInt({ min: 1, max: 30 })
    .withMessage('Days must be between 1 and 30'),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  sensorDataValidation,
  cityValidation,
  daysValidation,
  handleValidationErrors,
};
