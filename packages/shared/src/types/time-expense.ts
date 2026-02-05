/**
 * Time & Expense Domain Types
 */

export enum CaptureType {
  MANUAL = 'MANUAL',
  TIMER = 'TIMER',
  AUTO = 'AUTO',
}

export enum TimeEntryStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BILLED = 'BILLED',
}

export enum BillingType {
  TIME_BASED = 'TIME_BASED',
  FLAT_FEE = 'FLAT_FEE',
}

export enum InvoiceFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
}

export interface RoleLevel {
  id: string;
  roleName: string;
  description: string;
  defaultRate: number;
  minIncrement: 'SIX_MINUTE' | 'FIFTEEN_MINUTE';
  isActive: boolean;
}

export interface Adjuster {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleName: string;
  defaultRate: number;
  isActive: boolean;
}

export interface ActivityCode {
  id: string;
  code: string;
  name: string;
  category: 'INVESTIGATION' | 'COMMUNICATION' | 'REPORTING' | 'ADMINISTRATION';
  billingType: BillingType;
  billable: boolean;
  autoTriggerEnabled: boolean;
  isActive: boolean;
}

export interface TimeEntry {
  id: string;
  claimNumber: string;
  adjusterId: string;
  adjusterName: string;
  roleId: string;
  roleName: string;
  activityCodeId: string;
  activityCode: string;
  activityDescription: string;
  captureType: CaptureType;
  entryDate: string;
  duration: number; // in hours (fractional)
  rate: number;
  amount: number;
  carrierId?: string;
  carrierName?: string;
  status: TimeEntryStatus;
  notes?: string;
  autoEventRef?: string;
  createdBy: string;
  createdDate: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface ExpenseType {
  id: string;
  code: string;
  name: string;
  category: string;
  rateType: 'PASS_THROUGH' | 'FLAT_FEE' | 'PER_UNIT';
  defaultRate?: number;
  rateCap?: number;
  receiptRequired: boolean;
  isActive: boolean;
}

export interface ExpenseEntry {
  id: string;
  claimNumber: string;
  adjusterId: string;
  adjusterName: string;
  expenseTypeId: string;
  expenseCode: string;
  expenseDescription: string;
  entryDate: string;
  amount: number;
  quantity?: number;
  receiptAttached: boolean;
  receiptDocumentId?: string;
  status: TimeEntryStatus;
  notes?: string;
  createdBy: string;
  createdDate: string;
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface CarrierConfiguration {
  id: string;
  carrierName: string;
  carrierCode: string;
  invoiceFrequency: InvoiceFrequency;
  rateOverrides: CarrierRateOverride[];
  isActive: boolean;
}

export interface CarrierRateOverride {
  id: string;
  carrierId: string;
  roleId: string;
  roleName: string;
  overrideRate: number;
  effectiveDate: string;
  expirationDate?: string;
}

export interface EventTrigger {
  id: string;
  assureEventName: string;
  eventCode: string;
  mappedActivityCodeId: string;
  mappedActivityCode: string;
  autoBill: boolean;
  requiresReview: boolean;
  defaultDuration?: number;
  isActive: boolean;
}

export interface TimerSession {
  id: string;
  claimNumber: string;
  adjusterId: string;
  activityCodeId: string;
  startTime: string;
  endTime?: string;
  elapsedSeconds: number;
  isActive: boolean;
}
