import express from 'express';
import cors from 'cors';
import { assureClaimsRouter } from './routes/assure-claims.js';
import { serviceNowRouter } from './routes/servicenow.js';
import { vendorsRouter } from './routes/vendors.js';
import { referralsRouter } from './routes/referrals.js';
import { invoicesRouter } from './routes/invoices.js';
import { timeEntriesRouter } from './routes/time-entries.js';
import { expenseEntriesRouter } from './routes/expense-entries.js';
import { activityCodesRouter } from './routes/activity-codes.js';
import { expenseTypesRouter } from './routes/expense-types.js';

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

// API Routes - Assure Claims & ServiceNow
app.use('/api/v1/assure', assureClaimsRouter);
app.use('/api/v1/servicenow', serviceNowRouter);

// API Routes - Vendor Management
app.use('/api/v1/vendors', vendorsRouter);
app.use('/api/v1/referrals', referralsRouter);
app.use('/api/v1/invoices', invoicesRouter);

// API Routes - Time & Expense
app.use('/api/v1/time-entries', timeEntriesRouter);
app.use('/api/v1/expense-entries', expenseEntriesRouter);
app.use('/api/v1/activity-codes', activityCodesRouter);
app.use('/api/v1/expense-types', expenseTypesRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Documentation
app.get('/api/v1', (_req, res) => {
  res.json({
    version: '1.0',
    endpoints: {
      vendors: '/api/v1/vendors',
      referrals: '/api/v1/referrals',
      invoices: '/api/v1/invoices',
      timeEntries: '/api/v1/time-entries',
      expenseEntries: '/api/v1/expense-entries',
      activityCodes: '/api/v1/activity-codes',
      expenseTypes: '/api/v1/expense-types',
      assureClaims: '/api/v1/assure',
      serviceNow: '/api/v1/servicenow',
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   Vendors:        http://localhost:${PORT}/api/v1/vendors`);
  console.log(`   Referrals:      http://localhost:${PORT}/api/v1/referrals`);
  console.log(`   Invoices:       http://localhost:${PORT}/api/v1/invoices`);
  console.log(`   Time Entries:   http://localhost:${PORT}/api/v1/time-entries`);
  console.log(`   Expense Types:  http://localhost:${PORT}/api/v1/expense-types`);
  console.log(`   Assure Claims:  http://localhost:${PORT}/api/v1/assure`);
  console.log(`   ServiceNow:     http://localhost:${PORT}/api/v1/servicenow\n`);
});
