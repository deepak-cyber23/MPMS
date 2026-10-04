import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './backend/config/db.js';
import authRoutes from './backend/routes/authRoutes.js';
import serviceRoutes from './backend/routes/serviceRoutes.js';
import bookingRoutes from './backend/routes/bookingRoutes.js';
import enquiryRoutes from './backend/routes/enquiryRoutes.js';
import userRoutes from './backend/routes/userRoutes.js';
import dashboardRoutes from './backend/routes/dashboardRoutes.js';
import reportRoutes from './backend/routes/reportRoutes.js';
import pageRoutes from './backend/routes/pageRoutes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Connect to MongoDB / Mongoose Document Store
  const dbConnection = await connectDB();

  // Security & Body Parsing Middleware
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve generated images at /assets/images/*
  app.use('/assets/images', express.static(path.resolve(process.cwd(), 'src/assets/images')));

  // API Health & Database Connection Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      service: 'Movers & Packers Management System (MPMS) REST API',
      runtime: 'Node.js + Express.js (Standard JavaScript)',
      databaseMode: dbConnection.mode,
      databaseUri: dbConnection.uri,
      timestamp: new Date().toISOString(),
    });
  });

  // Mount REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/enquiries', enquiryRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/pages', pageRoutes);

  // 404 Handler for unmatched /api/* endpoints
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
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

  // Serve React Frontend via Vite in Development or Static Dist in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(3000, '0.0.0.0', () => {
    console.log(
      `[MPMS Server] Node.js Express.js server running on http://0.0.0.0:3000 (Port: ${PORT}) with MongoDB Mongoose`
    );
  });
}

startServer();
