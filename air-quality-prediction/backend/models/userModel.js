/**
 * User Model
 * Database operations for user management
 */

const { query } = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Object} Created user
 */
const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await query(
    `INSERT INTO users (name, email, password_hash, created_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING id, name, email, created_at, alert_enabled, alert_threshold`,
    [name, email, hashedPassword]
  );

  return result.rows[0];
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Object|null} User record
 */
const findUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Object|null} User record
 */
const findUserById = async (id) => {
  const result = await query(
    'SELECT id, name, email, created_at, alert_enabled, alert_threshold FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Verify user password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {boolean} Password matches
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Update user alert settings
 * @param {number} userId - User ID
 * @param {Object} settings - Alert settings
 * @returns {Object} Updated user
 */
const updateAlertSettings = async (userId, { alertEnabled, alertThreshold }) => {
  const result = await query(
    `UPDATE users 
     SET alert_enabled = $1, alert_threshold = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, email, alert_enabled, alert_threshold`,
    [alertEnabled, alertThreshold, userId]
  );
  return result.rows[0];
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Object} Updated user
 */
const updateUserProfile = async (userId, { name }) => {
  const result = await query(
    `UPDATE users 
     SET name = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, created_at, alert_enabled, alert_threshold`,
    [name, userId]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  updateAlertSettings,
  updateUserProfile,
};
