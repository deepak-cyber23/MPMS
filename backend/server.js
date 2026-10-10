import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import pageRoutes from './routes/pageRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Security & Body Parsing Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serverless / Netlify Function URL Normalization Middleware
// Ensures that paths rewritten by Netlify redirects (e.g. /.netlify/functions/api/* or /*)
// match standard Express routes mounted under /api/*
app.use((req, _res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '/api') || '/api';
  }
  // If the path arrives without /api prefix (e.g. Netlify rewrite stripping prefix)
  if (!req.url.startsWith('/api') && !req.url.startsWith('/assets')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Health check endpoints
app.get(['/api', '/api/health', '/health'], (_req, res) => {
  res.json({
    success: true,
    service: 'Movers & Packers Management System (MPMS) REST API',
    runtime: 'Node.js + Express.js (Netlify Serverless Functions / Standalone)',
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// Mount All REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pages', pageRoutes);

// 404 Handler for Unmatched /api/* endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
  });
});

// Global API Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error('[MPMS Server Error]:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
  });
});

export { app, connectDB };

if (process.env.STANDALONE_BACKEND === 'true') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[MPMS Backend] Dedicated Express backend running on port ${PORT}`);
    });
  });
}

export default app;
