# Project Structure

## Overview

This monorepo contains two Claims Smart App modules: **Vendor Management** and **Time & Expense**. Both are built with React, Halstack Design System, and TypeScript.

## Directory Layout

```
claims-smart-apps/
├── packages/
│   ├── vendor-management/      # Vendor Management React App
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── pages/          # Route-level page components
│   │   │   ├── services/       # API service layer
│   │   │   ├── contexts/       # React context providers
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── App.tsx         # Main application component
│   │   │   └── main.tsx        # Application entry point
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── time-expense/           # Time & Expense React App
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── shared/                 # Shared code across apps
│   │   ├── src/
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   │   ├── vendor.ts
│   │   │   │   ├── referral.ts
│   │   │   │   ├── invoice.ts
│   │   │   │   ├── time-expense.ts
│   │   │   │   ├── claim.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/          # Utility functions
│   │   │   │   ├── date-utils.ts
│   │   │   │   ├── format-utils.ts
│   │   │   │   └── validation-utils.ts
│   │   │   ├── hooks/          # Shared React hooks
│   │   │   │   ├── useDebounce.ts
│   │   │   │   └── useLocalStorage.ts
│   │   │   ├── components/     # Shared components (future)
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── mock-api/               # Mock API server
│       ├── src/
│       │   ├── routes/
│       │   │   ├── assure-claims.ts    # Assure Claims endpoints
│       │   │   └── servicenow.ts       # ServiceNow FSO endpoints
│       │   └── index.ts
│       └── package.json
│
├── docs/                       # Documentation
│   ├── PROJECT_STRUCTURE.md
│   ├── GETTING_STARTED.md
│   └── API_DOCUMENTATION.md
│
├── package.json                # Root workspace config
├── tsconfig.json               # Root TypeScript config
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier configuration
├── .gitignore
└── README.md
```

## Package Descriptions

### @claims-smart-apps/vendor-management

Vendor Management Smart App providing:
- Vendor onboarding and lifecycle management
- Referral creation and tracking
- Work item milestone tracking
- Invoice submission and approval
- Vendor portal access
- Performance analytics

**Key Routes:**
- `/dashboard` - Main dashboard with KPIs
- `/vendors` - Vendor directory and search
- `/vendors/:id` - Vendor details and management
- `/vendors/onboard/new` - Vendor onboarding workflow
- `/referrals` - Referral list and management
- `/referrals/new` - Create new referral
- `/referrals/:id` - Referral details and tracking
- `/invoices` - Invoice queue and processing
- `/portal` - Vendor portal view

### @claims-smart-apps/time-expense

Time & Expense Smart App providing:
- Manual time entry
- Timer-based time tracking
- Automated event-driven time capture
- Expense entry and tracking
- Billing review and submission
- Carrier-specific rate management
- Activity code and event trigger configuration

**Key Routes:**
- `/dashboard` - Time & expense overview
- `/time` - Time entry with timer widget
- `/expense` - Expense entry form
- `/billing` - Review and submit for billing
- `/reports` - Analytics and reporting
- `/config` - Configuration (admin)

### @claims-smart-apps/shared

Shared library containing:
- **Types**: TypeScript interfaces and enums for all domain models
- **Utils**: Common utility functions (date, format, validation)
- **Hooks**: Reusable React hooks
- **Components**: Shared UI components (future)

Used by both Vendor Management and Time & Expense apps.

### @claims-smart-apps/mock-api

Mock API server providing:
- **Assure Claims API**: Mock endpoints for claim context, activity journal, payments, documents
- **ServiceNow FSO API**: Mock endpoints for case management, notifications, workflow

Runs on `http://localhost:3001` during development.

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Halstack Design System (DXC Technology)
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm workspaces
- **API Mock**: Express.js
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Development Workflow

1. Install dependencies: `npm install`
2. Start all services: `npm run dev`
3. Start individual apps:
   - Vendor Management: `npm run dev:vendor`
   - Time & Expense: `npm run dev:time-expense`
   - Mock API: `npm run dev:mock-api`

## Build Process

All packages are built with `npm run build`. Production builds are output to each package's `dist/` directory.
