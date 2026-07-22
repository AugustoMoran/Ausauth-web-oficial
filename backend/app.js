require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');

const { apiLimiter } = require('./src/middleware/rateLimiter');
const errorHandler = require('./src/middleware/errorHandler');

// Routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const projectRoutes = require('./src/routes/projects');
const serviceRoutes = require('./src/routes/services');
const testimonialRoutes = require('./src/routes/testimonials');
const faqRoutes = require('./src/routes/faqs');
const categoryRoutes = require('./src/routes/categories');
const uploadRoutes = require('./src/routes/upload');
const webhookRoutes = require('./src/routes/webhook');
const popupRoutes = require('./src/routes/popup');
const chatRoutes = require('./src/routes/chat');
const testRoutes = require('./src/routes/test');
const locationRoutes = require('./src/routes/location');

// NEW: Quote and admin routes
const quoteRoutes = require('./src/routes/quote');
const quotesRoutes = require('./src/routes/quotes');
const adminUserRoutes = require('./src/routes/admin/users');
const settingsRoutes = require('./src/routes/settings');
const downloadRoutes = require('./src/routes/downloads');

// New isolated modules (do NOT touch ecommerce routes above)
const jobRoutes = require('./modules/jobs/job.routes');
const liquidationRoutes = require('./modules/liquidations/liquidation.routes');
const pdfRoutes = require('./modules/pdf/pdf.routes');

// Deploy marker (Render trigger): 2026-05-25-r2

const app = express();

// Trust proxy for Fly.io / reverse proxies (needed for rate limiter and IP detection)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://www.ausauth.com',
  'https://ausauth.com',
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // En desarrollo, acepta localhost en cualquier puerto
      if (process.env.NODE_ENV === 'development' && origin?.includes('localhost')) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (!origin) {
        // Requests sin origin (como mobile apps, Postman, etc)
        callback(null, true);
      } else {
        console.warn(`CORS bloqueado para origin: ${origin}`);
        callback(new Error('CORS no permitido'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Webhook raw body (must be before json parser)
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Sanitize NoSQL injection
app.use(mongoSanitize());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/popup', popupRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/test', testRoutes);
app.use('/api/location', locationRoutes);

// NEW: Quote and admin routes
app.use('/api/quote', quoteRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/downloads', downloadRoutes);

// ── New isolated modules ──────────────────────────────────────────────────────
app.use('/api/jobs', jobRoutes);
app.use('/api/liquidations', liquidationRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date() });
});

// TEST PDF ENDPOINT - Simple text response to verify server is working
app.get('/api/test-pdf', (req, res) => {
  try {
    console.log('🧪 TEST-PDF: Request received');
    
    // Send JSON response instead of trying to generate PDF
    // This will confirm the endpoint works
    res.json({
      success: true,
      message: 'PDF endpoint is working',
      timestamp: new Date().toISOString(),
      note: 'Use /api/quotes/:id/pdf to download actual PDFs'
    });
  } catch (e) {
    console.error('🧪 TEST-PDF: Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
