/**
 * Authentication Service
 * Handles user registration, login, and JWT management
 */

const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, verifyPassword } = require('../models/userModel');
const { sendWelcomeEmail } = require('../utils/emailService');
const logger = require('../utils/logger');

/**
 * Register a new user
 * @param {Object} userData - Registration data
 * @returns {Object} User and JWT token
 */
const register = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.status = 409;
    throw error;
  }

  // Create user
  const user = await createUser({ name, email, password });

  // Send welcome email (non-blocking)
  sendWelcomeEmail(email, name).catch((err) =>
    logger.warn('Welcome email failed', { email, error: err.message })
  );

  // Generate JWT
  const token = generateToken(user.id);

  logger.info('New user registered', { userId: user.id, email });

  return { user, token };
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User and JWT token
 */
const login = async (email, password) => {
  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  // Generate JWT
  const token = generateToken(user.id);

  logger.info('User logged in', { userId: user.id, email });

  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

/**
 * Generate JWT token
 * @param {number} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { register, login, generateToken, verifyToken };
