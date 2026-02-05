import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Mock case creation
router.post('/cases', (req: Request, res: Response) => {
  const { referral, claimContext } = req.body;

  const caseId = `CASE-${Date.now()}`;
  const caseNumber = `CSE-${Math.floor(Math.random() * 100000)}`;

  console.log(`ServiceNow case created:`, { caseId, caseNumber, referral });

  res.json({
    success: true,
    data: {
      caseId,
      caseNumber,
      status: 'ASSIGNED',
      createdDate: new Date().toISOString(),
      slaTarget: calculateSLATarget(referral?.serviceType),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Update case status
router.patch('/cases/:caseId', (req: Request, res: Response) => {
  const { caseId } = req.params;
  const { status, milestone, notes } = req.body;

  console.log(`ServiceNow case updated:`, { caseId, status, milestone });

  res.json({
    success: true,
    data: {
      caseId,
      status,
      milestone,
      updatedDate: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Get case details
router.get('/cases/:caseId', (req: Request, res: Response) => {
  const { caseId } = req.params;

  res.json({
    success: true,
    data: {
      caseId,
      caseNumber: `CSE-${caseId.split('-')[1]}`,
      status: 'IN_PROGRESS',
      assignedTo: 'Vendor User',
      createdDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Mock notification service
router.post('/notifications', (req: Request, res: Response) => {
  const { recipientId, notificationType, message } = req.body;

  console.log(`Notification sent:`, { recipientId, notificationType, message });

  res.json({
    success: true,
    data: {
      notificationId: uuidv4(),
      sentDate: new Date().toISOString(),
      deliveryStatus: 'SENT',
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    },
  });
});

// Helper function to calculate SLA target
function calculateSLATarget(serviceType?: string): string {
  const targetDays = serviceType === 'IME' ? 14 : serviceType === 'SURVEILLANCE' ? 7 : 10;
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + targetDays);
  return targetDate.toISOString();
}

export { router as serviceNowRouter };
