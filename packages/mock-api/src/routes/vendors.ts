import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockVendors } from '../data/mock-data.js';

const router = Router();

// Get all vendors
router.get('/', (req: Request, res: Response) => {
  const { status, type, search } = req.query;

  let filtered = [...mockVendors];

  if (status) {
    filtered = filtered.filter((v) => v.status === status);
  }
  if (type) {
    filtered = filtered.filter((v) => v.vendorType === type);
  }
  if (search) {
    const searchLower = (search as string).toLowerCase();
    filtered = filtered.filter((v) =>
      v.legalName.toLowerCase().includes(searchLower)
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

// Get vendor stats
router.get('/stats', (_req: Request, res: Response) => {
  const stats = {
    totalActive: mockVendors.filter((v) => v.status === 'ACTIVE').length,
    totalInactive: mockVendors.filter((v) => v.status === 'INACTIVE').length,
    pendingOnboarding: mockVendors.filter((v) => v.status === 'PENDING_DOCUMENTATION').length,
    totalReferrals: 12,
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

// Get vendor by ID
router.get('/:vendorId', (req: Request, res: Response) => {
  const { vendorId } = req.params;
  const vendor = mockVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'VENDOR_NOT_FOUND',
        message: `Vendor ${vendorId} not found`,
      },
    });
  }

  res.json({
    success: true,
    data: vendor,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Create vendor
router.post('/', (req: Request, res: Response) => {
  const newVendor = {
    ...req.body,
    id: `VEN-${Date.now()}`,
    createdDate: new Date().toISOString(),
    createdBy: 'USR-001',
    lastModifiedDate: new Date().toISOString(),
    lastModifiedBy: 'USR-001',
  };

  mockVendors.push(newVendor);

  res.status(201).json({
    success: true,
    data: newVendor,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Update vendor
router.patch('/:vendorId', (req: Request, res: Response) => {
  const { vendorId } = req.params;
  const index = mockVendors.findIndex((v) => v.id === vendorId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'VENDOR_NOT_FOUND',
        message: `Vendor ${vendorId} not found`,
      },
    });
  }

  mockVendors[index] = {
    ...mockVendors[index],
    ...req.body,
    lastModifiedDate: new Date().toISOString(),
    lastModifiedBy: 'USR-001',
  };

  res.json({
    success: true,
    data: mockVendors[index],
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as vendorsRouter };
