/**
 * Referral and Work Item Domain Types
 */

export enum ReferralStatus {
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  REVIEWED = 'REVIEWED',
  CANCELLED = 'CANCELLED',
}

export enum WorkMilestone {
  SCHEDULED = 'SCHEDULED',
  EXAM_DONE = 'EXAM_DONE',
  REPORT_DRAFT = 'REPORT_DRAFT',
  FINAL_REPORT = 'FINAL_REPORT',
}

export interface Referral {
  id: string;
  referralNumber: string;
  vendorId: string;
  vendorName: string;
  claimNumber: string;
  claimantName: string;
  dateOfLoss: string;
  claimType: string;
  handlerId: string;
  handlerName: string;
  serviceType: string;
  serviceCategory: string;
  status: ReferralStatus;
  assignedDate: string;
  dueDate?: string;
  completedDate?: string;
  instructions: string;
  estimatedCost?: number;
  approvalRequired: boolean;
  approvedBy?: string;
  approvedDate?: string;
  slaTarget?: string;
  slaBreach?: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface WorkItem {
  id: string;
  referralId: string;
  status: ReferralStatus;
  milestone?: WorkMilestone;
  updateType: 'STATUS_CHANGE' | 'MILESTONE_UPDATE' | 'DOCUMENT_UPLOAD' | 'NOTE_ADDED';
  notes?: string;
  updatedBy: string;
  updatedDate: string;
}

export interface ReferralDocument {
  id: string;
  referralId: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedDate: string;
  assureDocId?: string;
}

export interface Communication {
  id: string;
  referralId: string;
  senderType: 'VENDOR' | 'HANDLER' | 'SYSTEM';
  senderId: string;
  senderName: string;
  messageText: string;
  sentDate: string;
  readDate?: string;
  attachments?: string[];
}

export interface SchedulingInfo {
  preferredDates?: string[];
  location?: string;
  locationAddress?: string;
  specialRequirements?: string;
}
