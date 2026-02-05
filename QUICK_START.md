# Quick Start Guide

## Installation Complete ✅

All dependencies have been successfully installed with the corrected Halstack React version (16.0.0).

## Running the Applications

### Option 1: Start Everything at Once
```bash
npm run dev
```

This starts all three services:
- **Vendor Management App**: http://localhost:5173
- **Time & Expense App**: http://localhost:5174
- **Mock API Server**: http://localhost:3001

### Option 2: Start Individual Services

**Vendor Management only:**
```bash
npm run dev:vendor
```

**Time & Expense only:**
```bash
npm run dev:time-expense
```

**Mock API Server only:**
```bash
npm run dev:mock-api
```

## Testing the Setup

### 1. Test Vendor Management App
1. Open http://localhost:5173
2. You should see the Vendor Management Dashboard
3. Navigate through the routes to see the placeholder pages

### 2. Test Time & Expense App
1. Open http://localhost:5174
2. You should see the Time & Expense Dashboard
3. Explore the time entry and expense tracking pages

### 3. Test Mock API
Test the Assure Claims API:
```bash
curl http://localhost:3001/api/v1/assure/claims/CLM-2024-001234/context
```

Test the ServiceNow API:
```bash
curl http://localhost:3001/api/v1/servicenow/cases
```

## What's Included

### Vendor Management Features (Placeholder Pages)
- Dashboard with KPIs
- Vendor Directory
- Vendor Details & Onboarding
- Referral Management
- Invoice Processing
- Vendor Portal

### Time & Expense Features (Placeholder Pages)
- Dashboard with time tracking metrics
- Manual Time Entry
- Expense Entry
- Billing Review
- Reports & Analytics
- Configuration (Activity Codes, Rates)

### Mock API Endpoints
- **Assure Claims**: Claim context, activity journal, payments, documents
- **ServiceNow**: Case management, notifications, workflow

## Next Development Steps

1. **Implement Vendor Onboarding Workflow**
   - Multi-step wizard
   - Document upload
   - Approval routing

2. **Build Referral Creation Form**
   - Claim context integration
   - Vendor selection
   - ServiceNow case creation

3. **Create Time Entry Interface**
   - Manual entry form
   - Timer widget
   - Auto-capture event handlers

4. **Set Up Invoice Processing**
   - Invoice submission
   - Validation engine
   - Approval workflow

## Project Structure

```
claims-smart-apps/
├── packages/
│   ├── vendor-management/    # React app on port 5173
│   ├── time-expense/          # React app on port 5174
│   ├── shared/                # Shared types & utilities
│   └── mock-api/              # Express server on port 3001
└── docs/                      # Documentation
```

## Resources

- **Full Documentation**: See `/docs` directory
- **Project Structure**: `docs/PROJECT_STRUCTURE.md`
- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Business Requirements**: See original BRD document

## Troubleshooting

**Port already in use?**
```bash
# Change the port in vite.config.ts or use environment variable
PORT=5175 npm run dev:vendor
```

**Dependencies out of sync?**
```bash
npm run clean
npm install
```

**TypeScript errors?**
```bash
npm run lint
```

## Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review `INSTALLATION_NOTES.md`
3. Run `./verify-setup.sh` to check your environment
