/**
 * Invoice and Billing Domain Types
 */

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  DISPUTED = 'DISPUTED',
}

export enum ValidationResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  WARNING = 'WARNING',
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  referralId: string;
  vendorId: string;
  vendorName: string;
  claimNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  approvedAmount?: number;
  status: InvoiceStatus;
  submittedBy: string;
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  assurePaymentId?: string;
  paymentDate?: string;
  checkNumber?: string;
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  lineNumber: number;
  serviceCode: string;
  serviceDescription: string;
  serviceDate: string;
  quantity: number;
  unitRate: number;
  amount: number;
  feeScheduleRef?: string;
  varianceAmount?: number;
  varianceReason?: string;
}

export interface InvoiceValidation {
  invoiceId: string;
  validatedDate: string;
  overallResult: ValidationResult;
  checks: ValidationCheck[];
}

export interface ValidationCheck {
  checkType:
    | 'FEE_SCHEDULE'
    | 'CONTRACT_TERMS'
    | 'DUPLICATE'
    | 'AUTHORIZATION'
    | 'REQUIRED_DOCS'
    | 'TIMELY_FILING';
  result: ValidationResult;
  message: string;
  details?: string;
}

export interface PaymentRequest {
  payeeId: string;
  payeeName: string;
  payeeType: 'VENDOR' | 'ADJUSTER';
  invoiceReference: string;
  claimNumber: string;
  amount: number;
  reserveType: 'MEDICAL' | 'INDEMNITY' | 'EXPENSE';
  serviceDescription: string;
  serviceDate: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  expectedPaymentDate?: string;
  actualPaymentDate?: string;
  checkNumber?: string;
  errorMessage?: string;
}
