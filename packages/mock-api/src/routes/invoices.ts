import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockInvoices } from '../data/mock-data.js';

const router = Router();

// Get all invoices
router.get('/', (req: Request, res: Response) => {
  const { status, vendorId, claimNumber } = req.query;

  let filtered = [...mockInvoices];

  if (status) {
    filtered = filtered.filter((i) => i.status === status);
  }
  if (vendorId) {
    filtered = filtered.filter((i) => i.vendorId === vendorId);
  }
  if (claimNumber) {
    filtered = filtered.filter((i) => i.claimNumber === claimNumber);
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

// Get invoice stats
router.get('/stats', (_req: Request, res: Response) => {
  const stats = {
    totalPending: mockInvoices.filter((i) => i.status === 'PENDING_REVIEW').length,
    totalApproved: mockInvoices.filter((i) => i.status === 'APPROVED').length,
    totalPaid: mockInvoices.filter((i) => i.status === 'PAID').length,
    totalAmount: mockInvoices.reduce((sum, i) => sum + i.totalAmount, 0),
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

// Get invoice by ID
router.get('/:invoiceId', (req: Request, res: Response) => {
  const { invoiceId } = req.params;
  const invoice = mockInvoices.find((i) => i.id === invoiceId);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'INVOICE_NOT_FOUND',
        message: `Invoice ${invoiceId} not found`,
      },
    });
  }

  res.json({
    success: true,
    data: invoice,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Submit invoice
router.post('/', (req: Request, res: Response) => {
  const newInvoice = {
    ...req.body,
    id: `INV-${Date.now()}`,
    invoiceNumber: `INV-2024-${String(mockInvoices.length + 1).padStart(4, '0')}`,
    status: 'PENDING_REVIEW',
    submittedDate: new Date().toISOString(),
  };

  mockInvoices.push(newInvoice);

  res.status(201).json({
    success: true,
    data: newInvoice,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Approve invoice
router.post('/:invoiceId/approve', (req: Request, res: Response) => {
  const { invoiceId } = req.params;
  const { approvedAmount } = req.body;
  const index = mockInvoices.findIndex((i) => i.id === invoiceId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'INVOICE_NOT_FOUND',
        message: `Invoice ${invoiceId} not found`,
      },
    });
  }

  mockInvoices[index].status = 'APPROVED';
  mockInvoices[index].approvedAmount = approvedAmount || mockInvoices[index].totalAmount;
  mockInvoices[index].approvedBy = 'USR-001';
  mockInvoices[index].approvedDate = new Date().toISOString();

  res.json({
    success: true,
    data: mockInvoices[index],
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Reject invoice
router.post('/:invoiceId/reject', (req: Request, res: Response) => {
  const { invoiceId } = req.params;
  const { reason } = req.body;
  const index = mockInvoices.findIndex((i) => i.id === invoiceId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'INVOICE_NOT_FOUND',
        message: `Invoice ${invoiceId} not found`,
      },
    });
  }

  mockInvoices[index].status = 'REJECTED';
  mockInvoices[index].rejectionReason = reason;

  res.json({
    success: true,
    data: mockInvoices[index],
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as invoicesRouter };
