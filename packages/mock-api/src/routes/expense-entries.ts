import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockExpenseEntries } from '../data/mock-data.js';

const router = Router();

// Get all expense entries
router.get('/', (req: Request, res: Response) => {
  const { claimNumber, adjusterId, status } = req.query;

  let filtered = [...mockExpenseEntries];

  if (claimNumber) {
    filtered = filtered.filter((e) => e.claimNumber === claimNumber);
  }
  if (adjusterId) {
    filtered = filtered.filter((e) => e.adjusterId === adjusterId);
  }
  if (status) {
    filtered = filtered.filter((e) => e.status === status);
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

// Create expense entry
router.post('/', (req: Request, res: Response) => {
  const newEntry = {
    ...req.body,
    id: `EXP-${Date.now()}`,
    createdDate: new Date().toISOString(),
  };

  mockExpenseEntries.push(newEntry);

  res.status(201).json({
    success: true,
    data: newEntry,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Update expense entry
router.patch('/:entryId', (req: Request, res: Response) => {
  const { entryId } = req.params;
  const index = mockExpenseEntries.findIndex((e) => e.id === entryId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ENTRY_NOT_FOUND',
        message: `Expense entry ${entryId} not found`,
      },
    });
  }

  mockExpenseEntries[index] = {
    ...mockExpenseEntries[index],
    ...req.body,
  };

  res.json({
    success: true,
    data: mockExpenseEntries[index],
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Delete expense entry
router.delete('/:entryId', (req: Request, res: Response) => {
  const { entryId } = req.params;
  const index = mockExpenseEntries.findIndex((e) => e.id === entryId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ENTRY_NOT_FOUND',
        message: `Expense entry ${entryId} not found`,
      },
    });
  }

  mockExpenseEntries.splice(index, 1);

  res.json({
    success: true,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as expenseEntriesRouter };
