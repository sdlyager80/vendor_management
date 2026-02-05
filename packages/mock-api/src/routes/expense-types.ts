import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockExpenseTypes } from '../data/mock-data.js';

const router = Router();

// Get all expense types
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockExpenseTypes,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as expenseTypesRouter };
