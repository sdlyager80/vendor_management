import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockActivityCodes } from '../data/mock-data.js';

const router = Router();

// Get all activity codes
router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: mockActivityCodes,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

export { router as activityCodesRouter };
