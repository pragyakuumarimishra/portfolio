/**
 * Air Quality Monitoring System - Backend Server
 * Production-ready Express API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const outdoorRoutes = require('./routes/outdoorRoutes');
const aqiRoutes = require('./routes/aqiRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'http://localhost:3000'
      : ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Request logging
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/outdoor', outdoorRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/alerts', alertRoutes);

// Prediction route
const { getPredictions } = require('./controllers/aqiController');
const { authenticate } = require('./middleware/authMiddleware');
app.get('/api/predictions', authenticate, getPredictions);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', { error: err.message });
  shutdown('unhandledRejection');
});

module.exports = app;
