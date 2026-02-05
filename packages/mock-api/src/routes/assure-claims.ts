import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ClaimContext,
  ClaimStatus,
  ClaimType,
  ReserveType,
  PaymentRequest,
  PaymentStatus,
} from '@claims-smart-apps/shared';

const router = Router();

// Mock claim data store
const mockClaims: Record<string, ClaimContext> = {
  'CLM-2024-001234': {
    claimNumber: 'CLM-2024-001234',
    claimStatus: ClaimStatus.OPEN,
    dateOfLoss: '2024-01-15',
    claimType: ClaimType.WORKERS_COMP,
    claimant: {
      partyId: 'PTY-001',
      partyType: 'CLAIMANT',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-06-20',
      address: {
        street1: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
      },
      phone: '2175551234',
      email: 'john.doe@email.com',
    },
    handler: {
      userId: 'USR-001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@tpa.com',
      phone: '3125556789',
    },
    injury: {
      description: 'Lower back strain from lifting',
      bodyParts: ['Lower Back', 'Lumbar Spine'],
      treatmentStatus: 'ONGOING',
    },
    reserves: [
      { reserveType: ReserveType.MEDICAL, amount: 50000, paid: 12500, outstanding: 37500, lastUpdated: '2024-02-01' },
      { reserveType: ReserveType.INDEMNITY, amount: 25000, paid: 5000, outstanding: 20000, lastUpdated: '2024-02-01' },
      { reserveType: ReserveType.EXPENSE, amount: 10000, paid: 2500, outstanding: 7500, lastUpdated: '2024-02-01' },
    ],
    carrierId: 'CAR-001',
    carrierName: 'Acme Insurance',
    policyNumber: 'POL-WC-2024-5678',
  },
  'CLM-2024-002345': {
    claimNumber: 'CLM-2024-002345',
    claimStatus: ClaimStatus.OPEN,
    dateOfLoss: '2024-01-22',
    claimType: ClaimType.AUTO_LIABILITY,
    claimant: {
      partyId: 'PTY-002',
      partyType: 'CLAIMANT',
      firstName: 'Jane',
      lastName: 'Smith',
      address: {
        street1: '456 Oak Ave',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
      },
      phone: '3125552345',
      email: 'jane.smith@email.com',
    },
    handler: {
      userId: 'USR-002',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@tpa.com',
      phone: '3125557890',
    },
    reserves: [
      { reserveType: ReserveType.MEDICAL, amount: 75000, paid: 15000, outstanding: 60000, lastUpdated: '2024-02-05' },
      { reserveType: ReserveType.EXPENSE, amount: 15000, paid: 3000, outstanding: 12000, lastUpdated: '2024-02-05' },
    ],
    carrierId: 'CAR-002',
    carrierName: 'Global Indemnity',
    policyNumber: 'POL-AL-2024-9012',
  },
};

// Get claim context
router.get('/claims/:claimNumber/context', (req: Request, res: Response) => {
  const { claimNumber } = req.params;
  const claim = mockClaims[claimNumber];

  if (!claim) {
    return res.status(404).json({
      success: false,
      error: { code: 'CLAIM_NOT_FOUND', message: `Claim ${claimNumber} not found` },
    });
  }

  res.json({
    success: true,
    data: claim,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Post activity journal entry
router.post('/claims/:claimNumber/activity', (req: Request, res: Response) => {
  const { claimNumber } = req.params;
  const { activityType, description, userId } = req.body;

  if (!mockClaims[claimNumber]) {
    return res.status(404).json({
      success: false,
      error: { code: 'CLAIM_NOT_FOUND', message: `Claim ${claimNumber} not found` },
    });
  }

  const activityId = uuidv4();
  console.log(`Activity logged for ${claimNumber}:`, { activityId, activityType, description, userId });

  res.json({
    success: true,
    data: {
      activityId,
      claimNumber,
      activityType,
      description,
      timestamp: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Post payment request
router.post('/claims/:claimNumber/payments', (req: Request<{ claimNumber: string }, unknown, PaymentRequest>, res: Response) => {
  const { claimNumber } = req.params;
  const paymentRequest = req.body;

  if (!mockClaims[claimNumber]) {
    return res.status(404).json({
      success: false,
      error: { code: 'CLAIM_NOT_FOUND', message: `Claim ${claimNumber} not found` },
    });
  }

  const paymentId = `PAY-${Date.now()}`;
  const expectedPaymentDate = new Date();
  expectedPaymentDate.setDate(expectedPaymentDate.getDate() + 7);

  const paymentStatus: PaymentStatus = {
    paymentId,
    status: 'PENDING',
    expectedPaymentDate: expectedPaymentDate.toISOString().split('T')[0],
  };

  console.log(`Payment request created for ${claimNumber}:`, { paymentId, amount: paymentRequest.amount });

  res.json({
    success: true,
    data: paymentStatus,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Get payment status
router.get('/payments/:paymentId/status', (req: Request, res: Response) => {
  const { paymentId } = req.params;

  // Mock payment status progression
  const mockStatus: PaymentStatus = {
    paymentId,
    status: 'COMPLETED',
    actualPaymentDate: new Date().toISOString().split('T')[0],
    checkNumber: `CHK-${Math.floor(Math.random() * 100000)}`,
  };

  res.json({
    success: true,
    data: mockStatus,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Post document sync
router.post('/claims/:claimNumber/documents', (req: Request, res: Response) => {
  const { claimNumber } = req.params;
  const { documentType, fileName, uploadedBy } = req.body;

  if (!mockClaims[claimNumber]) {
    return res.status(404).json({
      success: false,
      error: { code: 'CLAIM_NOT_FOUND', message: `Claim ${claimNumber} not found` },
    });
  }

  const assureDocId = `DOC-${Date.now()}`;

  res.json({
    success: true,
    data: {
      assureDocId,
      claimNumber,
      documentType,
      fileName,
      uploadedBy,
      uploadedDate: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Webhook simulation - events
router.post('/events/webhook', (req: Request, res: Response) => {
  const { eventCode, claimNumber, eventData } = req.body;

  console.log(`Event received:`, { eventCode, claimNumber, eventData });

  res.json({
    success: true,
    data: {
      acknowledged: true,
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as assureClaimsRouter };
