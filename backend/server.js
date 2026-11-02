const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const requestRoutes = require('./routes/requestRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Root route - Welcome & Status Directory (for http://localhost:5000/)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    message: 'Welcome to UniGive REST API Backend!',
    project: 'UniGive - Verified Campus Peer-to-Peer Redistribution System',
    team: ['Altamash (Frontend Lead)', 'Abhishek (Backend Lead)', 'Afifa (Cloud Lead)', 'Abhinav (QA Lead)'],
    healthcheck: '/api/health',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register (requires @college.ac.in)',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile',
      },
      listings: {
        getAll: 'GET /api/listings?category=&search=&condition=&status=',
        create: 'POST /api/listings (Free, Barter, or Amount)',
        updateStatus: 'PATCH /api/listings/:id (post owner only)',
        takeDown: 'DELETE /api/listings/:id (post owner only)',
      },
      requests: {
        getAll: 'GET /api/requests?category=&search=',
        create: 'POST /api/requests',
        takeDown: 'DELETE /api/requests/:id (request owner only)',
      },
      media: {
        upload: 'POST /api/upload (Cloudinary / file buffer)',
      },
    },
  });
});

// Healthcheck & PRD Metadata
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'UniGive - Verified Campus Peer-to-Peer Redistribution System',
    team: ['Altamash', 'Abhishek', 'Afifa', 'Abhinav'],
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 UniGive API Server is running on port ${PORT}`);
  console.log(`🔗 Local Base URL: http://localhost:${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
