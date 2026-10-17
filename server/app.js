const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const paperRoutes = require('./routes/paperRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware: JSON parser with payload limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware: CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin in Vercel)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for deployment flexibility
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// DB connection middleware for serverless invocations
app.use(async (req, res, next) => {
  // Only connect to DB on /api routes
  if (req.path.startsWith('/api') && req.path !== '/api/health-check') {
    try {
      if (process.env.MONGODB_URI) {
        await connectDB();
      }
    } catch (err) {
      console.error('Database connection error in middleware:', err.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please ensure MONGODB_URI is properly configured.',
        error: err.message,
      });
    }
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbConfigured: Boolean(process.env.MONGODB_URI),
  });
});

// Paper API routes
app.use('/api/papers', paperRoutes);

// Catch-all 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
