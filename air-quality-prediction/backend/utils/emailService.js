/**
 * Email Notification Service
 * Sends alert emails to users
 */

const { createTransporter } = require('../config/email');
const logger = require('./logger');

/**
 * Send AQI alert email
 * @param {string} to - Recipient email address
 * @param {Object} alertData - Alert information
 */
const sendAQIAlert = async (to, alertData) => {
  try {
    const transporter = createTransporter();
    const { aqi, category, location, timestamp } = alertData;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Air Quality Monitor <noreply@airquality.com>',
      to,
      subject: `⚠️ Air Quality Alert: ${category} (AQI: ${aqi})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Air Quality Alert</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid ${getAlertColor(aqi)};">
              <h2 style="color: #333; margin-top: 0;">Current Air Quality: <span style="color: ${getAlertColor(aqi)};">${category}</span></h2>
              <p style="font-size: 48px; font-weight: bold; color: ${getAlertColor(aqi)}; margin: 10px 0;">${aqi}</p>
              <p style="color: #666; margin: 0;">AQI Index</p>
            </div>

            <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #333;">Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; color: #666;">Location:</td>
                  <td style="padding: 8px; color: #333; font-weight: bold;">${location || 'Indoor Sensor'}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 8px; color: #666;">Time:</td>
                  <td style="padding: 8px; color: #333; font-weight: bold;">${new Date(timestamp).toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="background: #fff3cd; border-radius: 8px; padding: 20px;">
              <h3 style="color: #856404; margin-top: 0;">Health Recommendations</h3>
              <p style="color: #856404;">${getHealthRecommendation(aqi)}</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              Air Quality Monitoring System | Automated Alert
            </p>
          </div>
        </div>
      `,
      text: `Air Quality Alert: ${category} (AQI: ${aqi})\nLocation: ${location || 'Indoor Sensor'}\nTime: ${new Date(timestamp).toLocaleString()}\n\n${getHealthRecommendation(aqi)}`,
    };

    await transporter.sendMail(mailOptions);
    logger.info('AQI alert email sent', { to, aqi, category });
  } catch (error) {
    logger.error('Failed to send AQI alert email', { to, error: error.message });
    throw error;
  }
};

/**
 * Send welcome email to new user
 * @param {string} to - Recipient email address
 * @param {string} name - User's name
 */
const sendWelcomeEmail = async (to, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Air Quality Monitor <noreply@airquality.com>',
      to,
      subject: '🌱 Welcome to Air Quality Monitor!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome, ${name}!</h1>
          </div>
          <div style="padding: 30px;">
            <p>Thank you for joining Air Quality Monitor. You can now:</p>
            <ul>
              <li>Monitor real-time indoor air quality</li>
              <li>Track outdoor AQI for multiple cities</li>
              <li>Receive alerts when air quality changes</li>
              <li>View historical data and predictions</li>
            </ul>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info('Welcome email sent', { to, name });
  } catch (error) {
    logger.error('Failed to send welcome email', { to, error: error.message });
    // Non-critical error, don't throw
  }
};

const getAlertColor = (aqi) => {
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 150) return '#ff7e00';
  if (aqi <= 200) return '#ff0000';
  if (aqi <= 300) return '#8f3f97';
  return '#7e0023';
};

const getHealthRecommendation = (aqi) => {
  if (aqi <= 50) return 'Air quality is good. Enjoy outdoor activities.';
  if (aqi <= 100) return 'Air quality is moderate. Sensitive individuals should limit prolonged outdoor exertion.';
  if (aqi <= 150) return 'Unhealthy for sensitive groups. Limit outdoor activities if you are sensitive.';
  if (aqi <= 200) return 'Unhealthy. Everyone should limit prolonged outdoor exertion.';
  if (aqi <= 300) return 'Very unhealthy. Avoid prolonged outdoor exertion. Wear a mask outside.';
  return 'Hazardous. Stay indoors! Everyone should avoid all outdoor exertion.';
};

module.exports = { sendAQIAlert, sendWelcomeEmail };
