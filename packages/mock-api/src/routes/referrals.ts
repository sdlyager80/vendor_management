import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockReferrals } from '../data/mock-data.js';

const router = Router();

// Get all referrals
router.get('/', (req: Request, res: Response) => {
  const { status, vendorId, claimNumber } = req.query;

  let filtered = [...mockReferrals];

  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }
  if (vendorId) {
    filtered = filtered.filter((r) => r.vendorId === vendorId);
  }
  if (claimNumber) {
    filtered = filtered.filter((r) => r.claimNumber === claimNumber);
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

// Get referral stats
router.get('/stats', (_req: Request, res: Response) => {
  const stats = {
    totalOpen: mockReferrals.filter((r) =>
      ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)
    ).length,
    totalCompleted: mockReferrals.filter((r) => r.status === 'COMPLETE').length,
    slaBreaches: mockReferrals.filter((r) => r.slaBreach).length,
    avgCompletionTime: 7,
  };

  res.json({
    success: true,
    data: stats,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Get referral by ID
router.get('/:referralId', (req: Request, res: Response) => {
  const { referralId } = req.params;
  const referral = mockReferrals.find((r) => r.id === referralId);

  if (!referral) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'REFERRAL_NOT_FOUND',
        message: `Referral ${referralId} not found`,
      },
    });
  }

  res.json({
    success: true,
    data: referral,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Create referral
router.post('/', (req: Request, res: Response) => {
  const newReferral = {
    ...req.body,
    id: `REF-${Date.now()}`,
    referralNumber: `REF-2024-${String(mockReferrals.length + 1).padStart(4, '0')}`,
    status: 'ASSIGNED',
    assignedDate: new Date().toISOString(),
    createdDate: new Date().toISOString(),
    createdBy: 'USR-001',
    lastModifiedDate: new Date().toISOString(),
  };

  mockReferrals.push(newReferral);

  res.status(201).json({
    success: true,
    data: newReferral,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Update referral status
router.patch('/:referralId/status', (req: Request, res: Response) => {
  const { referralId } = req.params;
  const { status, notes } = req.body;
  const index = mockReferrals.findIndex((r) => r.id === referralId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'REFERRAL_NOT_FOUND',
        message: `Referral ${referralId} not found`,
      },
    });
  }

  mockReferrals[index].status = status;
  mockReferrals[index].lastModifiedDate = new Date().toISOString();

  res.json({
    success: true,
    data: mockReferrals[index],
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as referralsRouter };
