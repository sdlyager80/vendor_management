# Claims Smart Apps

A monorepo containing Vendor Management and Time & Expense modules for DXC Claims Smart Apps platform.

## Architecture

Built on:
- **UI Framework**: Halstack Design System with React
- **Workflow Engine**: ServiceNow FSO (mocked for development)
- **Integration**: Assure Risk Management (Assure Claims) via mock APIs
- **Language**: TypeScript
- **Package Manager**: npm workspaces

## Project Structure

```
claims-smart-apps/
├── packages/
│   ├── vendor-management/     # Vendor Management Smart App
│   ├── time-expense/           # Time & Expense Smart App
│   ├── shared/                 # Shared utilities, types, components
│   └── mock-api/               # Mock ServiceNow FSO & Assure Claims APIs
├── package.json                # Root workspace configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies
npm install
```

### Development

```bash
# Run all applications in development mode
npm run dev

# Run specific application
npm run dev:vendor              # Vendor Management only
npm run dev:time-expense        # Time & Expense only
npm run dev:mock-api            # Mock API server only
```

### Build

```bash
# Build all packages
npm run build
```

### Testing

```bash
# Run all tests
npm run test
```

## Modules

### Vendor Management
Unified platform for managing vendor engagement lifecycle:
- Vendor onboarding and credentialing
- Referral processing and work tracking
- Billing and invoice management
- Performance analytics
- Vendor portal (operations & billing personas)

### Time & Expense
Adjuster time capture and expense tracking:
- Manual time entry
- Timer-based tracking
- Automated event-driven time capture
- Configurable expense management
- Carrier-specific billing rules

## Development URLs

- Vendor Management: http://localhost:5173
- Time & Expense: http://localhost:5174
- Mock API Server: http://localhost:3001

## Documentation

See `/docs` directory for:
- Business Requirements Document
- Technical Architecture
- API Specifications
- Data Model Documentation
