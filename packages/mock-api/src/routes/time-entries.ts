import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockTimeEntries, mockActivityCodes } from '../data/mock-data.js';

const router = Router();

// Get all time entries
router.get('/', (req: Request, res: Response) => {
  const { claimNumber, adjusterId, status, startDate, endDate } = req.query;

  let filtered = [...mockTimeEntries];

  if (claimNumber) {
    filtered = filtered.filter((t) => t.claimNumber === claimNumber);
  }
  if (adjusterId) {
    filtered = filtered.filter((t) => t.adjusterId === adjusterId);
  }
  if (status) {
    filtered = filtered.filter((t) => t.status === status);
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

// Get time entry stats
router.get('/stats', (req: Request, res: Response) => {
  const { adjusterId } = req.query;

  const filtered = adjusterId
    ? mockTimeEntries.filter((t) => t.adjusterId === adjusterId)
    : mockTimeEntries;

  const today = new Date().toISOString().split('T')[0];
  const todayEntries = filtered.filter((t) => t.entryDate === today);

  const stats = {
    todayHours: todayEntries.reduce((sum, t) => sum + t.duration, 0),
    weekHours: filtered.reduce((sum, t) => sum + t.duration, 0),
    monthHours: filtered.reduce((sum, t) => sum + t.duration, 0),
    pendingEntries: filtered.filter((t) => t.status === 'DRAFT').length,
    autoCaptured: filtered.filter((t) => t.captureType === 'AUTO').length,
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

// Create time entry
router.post('/', (req: Request, res: Response) => {
  const newEntry = {
    ...req.body,
    id: `TIME-${Date.now()}`,
    createdDate: new Date().toISOString(),
  };

  mockTimeEntries.push(newEntry);

  res.status(201).json({
    success: true,
    data: newEntry,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Update time entry
router.patch('/:entryId', (req: Request, res: Response) => {
  const { entryId } = req.params;
  const index = mockTimeEntries.findIndex((t) => t.id === entryId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ENTRY_NOT_FOUND',
        message: `Time entry ${entryId} not found`,
      },
    });
  }

  mockTimeEntries[index] = {
    ...mockTimeEntries[index],
    ...req.body,
  };

  res.json({
    success: true,
    data: mockTimeEntries[index],
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Delete time entry
router.delete('/:entryId', (req: Request, res: Response) => {
  const { entryId } = req.params;
  const index = mockTimeEntries.findIndex((t) => t.id === entryId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ENTRY_NOT_FOUND',
        message: `Time entry ${entryId} not found`,
      },
    });
  }

  mockTimeEntries.splice(index, 1);

  res.json({
    success: true,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Submit for billing
router.post('/submit', (req: Request, res: Response) => {
  const { entryIds } = req.body;

  entryIds.forEach((id: string) => {
    const entry = mockTimeEntries.find((t) => t.id === id);
    if (entry) {
      entry.status = 'SUBMITTED';
      entry.submittedDate = new Date().toISOString();
    }
  });

  res.json({
    success: true,
    data: { submitted: entryIds.length },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as timeEntriesRouter };
