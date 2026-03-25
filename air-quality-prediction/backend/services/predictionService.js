/**
 * AQI Prediction Service
 * 6-hour AQI predictions using simple ML (weighted moving average + trend analysis)
 */

const { getRecentReadingsForPrediction } = require('../models/readingModel');
const { getAQICategory } = require('../utils/aqiCalculator');
const logger = require('../utils/logger');

/**
 * Generate 6-hour AQI predictions
 * Uses exponential smoothing with trend detection
 * @param {number} userId - User ID
 * @returns {Array} Array of predictions for next 6 hours
 */
const generatePredictions = async (userId) => {
  const readings = await getRecentReadingsForPrediction(userId, 24);

  if (readings.length < 3) {
    return {
      available: false,
      message: 'Insufficient historical data for predictions. Need at least 3 readings.',
    };
  }

  // Extract AQI values
  const aqiValues = readings.map((r) => parseFloat(r.aqi));

  // Calculate exponential moving average
  const alpha = 0.3; // Smoothing factor
  const ema = calculateEMA(aqiValues, alpha);

  // Detect trend
  const trend = detectTrend(aqiValues.slice(-6));

  // Generate 6-hour predictions
  const predictions = [];
  let lastValue = ema[ema.length - 1];
  const now = new Date();

  for (let i = 1; i <= 6; i++) {
    // Apply trend with dampening
    const dampening = Math.pow(0.8, i); // Dampening factor
    const predicted = Math.max(0, Math.min(500, lastValue + trend * dampening));

    // Add some variance based on historical std deviation
    const stdDev = calculateStdDev(aqiValues.slice(-12));
    const variance = (Math.random() - 0.5) * stdDev * 0.3;
    const finalPrediction = Math.max(0, Math.min(500, Math.round(predicted + variance)));

    const predictionTime = new Date(now.getTime() + i * 60 * 60 * 1000);
    const category = getAQICategory(finalPrediction);

    predictions.push({
      hour: i,
      timestamp: predictionTime.toISOString(),
      aqi: finalPrediction,
      category: category.label,
      color: category.color,
      confidence: Math.max(50, 95 - i * 7), // Confidence decreases over time
    });

    lastValue = finalPrediction;
  }

  // Calculate trend description
  const trendDescription = getTrendDescription(trend);

  logger.info('Predictions generated', { userId, hours: predictions.length });

  return {
    available: true,
    currentAQI: Math.round(aqiValues[aqiValues.length - 1]),
    predictions,
    trend: trendDescription,
    basedOnReadings: readings.length,
    generatedAt: now.toISOString(),
  };
};

/**
 * Calculate Exponential Moving Average
 * @param {Array} values - Array of numerical values
 * @param {number} alpha - Smoothing factor (0-1)
 * @returns {Array} EMA values
 */
const calculateEMA = (values, alpha) => {
  const ema = [values[0]];
  for (let i = 1; i < values.length; i++) {
    ema.push(alpha * values[i] + (1 - alpha) * ema[i - 1]);
  }
  return ema;
};

/**
 * Detect trend using linear regression
 * @param {Array} values - Recent values
 * @returns {number} Trend slope
 */
const detectTrend = (values) => {
  if (values.length < 2) return 0;

  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((sum, v) => sum + v, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }

  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Calculate standard deviation
 * @param {Array} values - Array of values
 * @returns {number} Standard deviation
 */
const calculateStdDev = (values) => {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map((v) => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * Get human-readable trend description
 * @param {number} trend - Trend slope
 * @returns {string} Trend description
 */
const getTrendDescription = (trend) => {
  if (trend > 5) return 'rapidly_increasing';
  if (trend > 2) return 'increasing';
  if (trend > 0.5) return 'slightly_increasing';
  if (trend < -5) return 'rapidly_decreasing';
  if (trend < -2) return 'decreasing';
  if (trend < -0.5) return 'slightly_decreasing';
  return 'stable';
};

module.exports = { generatePredictions };
