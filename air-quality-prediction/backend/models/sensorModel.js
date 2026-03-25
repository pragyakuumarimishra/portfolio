/**
 * Sensor Model
 * Database operations for IoT sensor management
 */

const { query } = require('../config/db');

/**
 * Register a new sensor
 * @param {Object} sensorData - Sensor data
 * @returns {Object} Created sensor
 */
const createSensor = async ({ userId, deviceId, name, location }) => {
  const result = await query(
    `INSERT INTO sensors (user_id, device_id, name, location, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING *`,
    [userId, deviceId, name, location]
  );
  return result.rows[0];
};

/**
 * Find sensor by device ID
 * @param {string} deviceId - Device identifier
 * @returns {Object|null} Sensor record
 */
const findSensorByDeviceId = async (deviceId) => {
  const result = await query('SELECT * FROM sensors WHERE device_id = $1', [deviceId]);
  return result.rows[0] || null;
};

/**
 * Find sensors by user ID
 * @param {number} userId - User ID
 * @returns {Array} List of sensors
 */
const findSensorsByUserId = async (userId) => {
  const result = await query(
    'SELECT * FROM sensors WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

/**
 * Update sensor last seen timestamp
 * @param {number} sensorId - Sensor ID
 * @returns {Object} Updated sensor
 */
const updateSensorLastSeen = async (sensorId) => {
  const result = await query(
    'UPDATE sensors SET last_seen = NOW() WHERE id = $1 RETURNING *',
    [sensorId]
  );
  return result.rows[0];
};

/**
 * Get or create sensor for a user
 * @param {number} userId - User ID
 * @param {string} deviceId - Device identifier
 * @returns {Object} Sensor record
 */
const getOrCreateSensor = async (userId, deviceId) => {
  let sensor = await findSensorByDeviceId(deviceId);

  if (!sensor) {
    sensor = await createSensor({
      userId,
      deviceId,
      name: `Sensor ${deviceId}`,
      location: 'Indoor',
    });
  }

  return sensor;
};

module.exports = {
  createSensor,
  findSensorByDeviceId,
  findSensorsByUserId,
  updateSensorLastSeen,
  getOrCreateSensor,
};
