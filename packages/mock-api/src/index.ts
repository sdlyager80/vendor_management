import express from 'express';
import cors from 'cors';
import { assureClaimsRouter } from './routes/assure-claims.js';
import { serviceNowRouter } from './routes/servicenow.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/v1/assure', assureClaimsRouter);
app.use('/api/v1/servicenow', serviceNowRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`Assure Claims API: http://localhost:${PORT}/api/v1/assure`);
  console.log(`ServiceNow API: http://localhost:${PORT}/api/v1/servicenow`);
});
