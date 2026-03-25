/**
 * Email Service Configuration
 * Nodemailer transporter setup
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

/**
 * Initialize email transporter
 * @returns {Object} Nodemailer transporter instance
 */
const createTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Verify connection configuration in production
  if (process.env.NODE_ENV === 'production') {
    transporter.verify((error) => {
      if (error) {
        logger.error('Email transporter verification failed', { error: error.message });
      } else {
        logger.info('Email server is ready to send messages');
      }
    });
  }

  return transporter;
};

module.exports = { createTransporter };
