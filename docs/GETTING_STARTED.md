# Getting Started

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** (optional, for version control)

## Installation

1. Clone or navigate to the project directory:

```bash
cd /path/to/vendor_management
```

2. Install all dependencies:

```bash
npm install
```

This will install dependencies for all packages in the monorepo (vendor-management, time-expense, shared, mock-api).

## Running the Applications

### Start All Services

To run both applications and the mock API server simultaneously:

```bash
npm run dev
```

This will start:
- **Vendor Management**: http://localhost:5173
- **Time & Expense**: http://localhost:5174
- **Mock API Server**: http://localhost:3001

### Start Individual Services

To run services individually:

```bash
# Vendor Management only
npm run dev:vendor

# Time & Expense only
npm run dev:time-expense

# Mock API server only
npm run dev:mock-api
```

## Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed information about the monorepo layout.

## Development

### Making Changes to Shared Code

The `packages/shared` directory contains types, utilities, and components used by both applications. Changes here are automatically reflected in both apps during development.

### Adding New Types

Add TypeScript types to `packages/shared/src/types/`:

```typescript
// packages/shared/src/types/my-type.ts
export interface MyType {
  id: string;
  name: string;
}

// Export from index
// packages/shared/src/types/index.ts
export * from './my-type';
```

### Adding API Endpoints

Add mock endpoints to `packages/mock-api/src/routes/`:

```typescript
// packages/mock-api/src/routes/my-router.ts
import { Router } from 'express';

const router = Router();

router.get('/my-endpoint', (req, res) => {
  res.json({ success: true, data: {} });
});

export { router as myRouter };
```

Then register in `packages/mock-api/src/index.ts`:

```typescript
import { myRouter } from './routes/my-router.js';
app.use('/api/v1/my-service', myRouter);
```

### Code Quality

Run linting across all packages:

```bash
npm run lint
```

Run type checking:

```bash
npm run build
```

## Building for Production

Build all packages:

```bash
npm run build
```

This compiles TypeScript and bundles the applications for production deployment.

## Testing the Mock APIs

### Assure Claims API

Base URL: `http://localhost:3001/api/v1/assure`

Example endpoints:
- `GET /claims/:claimNumber/context` - Get claim context
- `POST /claims/:claimNumber/activity` - Post activity journal entry
- `POST /claims/:claimNumber/payments` - Submit payment request
- `GET /payments/:paymentId/status` - Get payment status

### ServiceNow API

Base URL: `http://localhost:3001/api/v1/servicenow`

Example endpoints:
- `POST /cases` - Create new case
- `PATCH /cases/:caseId` - Update case status
- `GET /cases/:caseId` - Get case details
- `POST /notifications` - Send notification

### Test with cURL

```bash
# Get claim context
curl http://localhost:3001/api/v1/assure/claims/CLM-2024-001234/context

# Create a case
curl -X POST http://localhost:3001/api/v1/servicenow/cases \
  -H "Content-Type: application/json" \
  -d '{"referral": {"serviceType": "IME"}, "claimContext": {}}'
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error, you can change the ports in the package-specific `vite.config.ts` or by setting environment variables:

```bash
PORT=5175 npm run dev:vendor
```

### Module Resolution Issues

If TypeScript can't find the shared package, try:

```bash
npm install
npm run build --workspace=packages/shared
```

### Halstack Components Not Rendering

Make sure the DxcProvider is wrapping your application in both `main.tsx` files:

```tsx
<DxcProvider>
  <App />
</DxcProvider>
```

## Next Steps

- Review the [Business Requirements Document](../BRD.md)
- Explore the [API Documentation](./API_DOCUMENTATION.md)
- Start implementing features based on the requirements
- Set up git repository: `git init && git add . && git commit -m "Initial setup"`
