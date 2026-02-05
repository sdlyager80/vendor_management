import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockAdjusters } from '../data/mock-data.js';

const router = Router();

// Get all adjusters
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockAdjusters,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Get single adjuster by ID
router.get('/:id', (req: Request, res: Response) => {
  const adjuster = mockAdjusters.find((a) => a.id === req.params.id);

  if (!adjuster) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Adjuster not found',
      },
    });
  }

  res.json({
    success: true,
    data: adjuster,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as adjustersRouter };
