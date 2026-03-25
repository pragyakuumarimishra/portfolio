/**
 * Database Migration Script
 * Creates all tables with proper schema and indexes
 */

require('dotenv').config();
const { pool } = require('../config/db');
const logger = require('../utils/logger');

const migrate = async () => {
  const client = await pool.connect();

  try {
    logger.info('Starting database migration...');

    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        alert_enabled BOOLEAN DEFAULT TRUE,
        alert_threshold INTEGER DEFAULT 100,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    logger.info('Created users table');

    // Create sensors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sensors (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        device_id VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL DEFAULT 'My Sensor',
        location VARCHAR(255) DEFAULT 'Indoor',
        last_seen TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, device_id)
      )
    `);
    logger.info('Created sensors table');

    // Create readings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS readings (
        id SERIAL PRIMARY KEY,
        sensor_id INTEGER NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        pm25 NUMERIC(8,2) NOT NULL,
        pm10 NUMERIC(8,2),
        co2 NUMERIC(8,2),
        temperature NUMERIC(6,2),
        humidity NUMERIC(5,2),
        aqi INTEGER NOT NULL,
        recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    logger.info('Created readings table');

    // Create alerts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        aqi INTEGER,
        severity VARCHAR(20) DEFAULT 'warning',
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    logger.info('Created alerts table');

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
      CREATE INDEX IF NOT EXISTS idx_readings_recorded_at ON readings(recorded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_readings_user_recorded ON readings(user_id, recorded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_sensors_user_id ON sensors(user_id);
      CREATE INDEX IF NOT EXISTS idx_sensors_device_id ON sensors(device_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
      CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_alerts_user_read ON alerts(user_id, is_read);
    `);
    logger.info('Created indexes');

    await client.query('COMMIT');
    logger.info('✅ Database migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Migration failed', { error: error.message });
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch((error) => {
  logger.error('Migration script failed', { error: error.message });
  process.exit(1);
});
