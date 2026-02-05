import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  mockClaims,
  mockTimeEntries,
  mockExpenseEntries,
  mockAssureClaimsEvents,
} from '../data/mock-data.js';

const router = Router();

// Get all claims
router.get('/', (req: Request, res: Response) => {
  const { status, adjusterId, carrierName } = req.query;

  let filtered = [...mockClaims];

  if (status) {
    filtered = filtered.filter((c) => c.claimStatus === status);
  }
  if (adjusterId) {
    filtered = filtered.filter((c) => c.adjusterId === adjusterId);
  }
  if (carrierName) {
    filtered = filtered.filter((c) =>
      c.carrierName.toLowerCase().includes((carrierName as string).toLowerCase())
    );
  }

  res.json({
    success: true,
    data: filtered,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Get claim by number with full details
router.get('/:claimNumber', (req: Request, res: Response) => {
  const { claimNumber } = req.params;
  const claim = mockClaims.find((c) => c.claimNumber === claimNumber);

  if (!claim) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'CLAIM_NOT_FOUND',
        message: `Claim ${claimNumber} not found`,
      },
    });
  }

  // Get time and expense entries for this claim
  const timeEntries = mockTimeEntries.filter((t) => t.claimNumber === claimNumber);
  const expenseEntries = mockExpenseEntries.filter((e) => e.claimNumber === claimNumber);
  const events = mockAssureClaimsEvents.filter((ev) => ev.claimNumber === claimNumber);

  // Calculate billing summary
  const totalHours = timeEntries.reduce((sum, t) => sum + t.duration, 0);
  const totalAmount = timeEntries.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, e) => sum + e.amount, 0);
  const autoCapturedCount = timeEntries.filter((t) => t.captureType === 'AUTO').length;
  const autoCapturedPercentage =
    timeEntries.length > 0 ? (autoCapturedCount / timeEntries.length) * 100 : 0;

  const billingSummary = {
    totalHours,
    totalAmount,
    totalExpenses,
    autoCapturedPercentage,
    autoCapturedCount,
    totalEntries: timeEntries.length,
    pendingAmount: timeEntries
      .filter((t) => t.status === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  res.json({
    success: true,
    data: {
      ...claim,
      timeEntries,
      expenseEntries,
      events,
      billingSummary,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as claimsRouter };
