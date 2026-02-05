/**
 * Vendor Management Domain Types
 */

export enum VendorStatus {
  PROSPECTIVE = 'PROSPECTIVE',
  PENDING_DOCUMENTATION = 'PENDING_DOCUMENTATION',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_HOLD = 'ON_HOLD',
  TERMINATED = 'TERMINATED',
  REJECTED = 'REJECTED',
}

export enum VendorType {
  IME = 'IME',
  FIELD_ADJUSTER = 'FIELD_ADJUSTER',
  APPRAISER = 'APPRAISER',
  SURVEILLANCE = 'SURVEILLANCE',
  SIU = 'SIU',
  LEGAL_COUNSEL = 'LEGAL_COUNSEL',
  NURSE_CASE_MANAGER = 'NURSE_CASE_MANAGER',
  SUBROGATION = 'SUBROGATION',
  SALVAGE_RECOVERY = 'SALVAGE_RECOVERY',
  RESTORATION = 'RESTORATION',
  MEDICAL_BILL_REVIEW = 'MEDICAL_BILL_REVIEW',
  EXPERT_WITNESS = 'EXPERT_WITNESS',
}

export enum PaymentMethod {
  ACH = 'ACH',
  CHECK = 'CHECK',
  WIRE = 'WIRE',
}

export enum PaymentTerms {
  NET_30 = 'NET_30',
  NET_45 = 'NET_45',
  NET_60 = 'NET_60',
}

export enum DocumentType {
  NDA = 'NDA',
  SOW = 'SOW',
  SLA = 'SLA',
  PRICING_SCHEDULE = 'PRICING_SCHEDULE',
  RATE_CARD = 'RATE_CARD',
  COI = 'COI',
  W9 = 'W9',
  CONTRACT = 'CONTRACT',
  AMENDMENT = 'AMENDMENT',
}

export interface VendorContact {
  id: string;
  role: 'PRIMARY' | 'BILLING' | 'OPERATIONS';
  name: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  documentType: DocumentType;
  fileName: string;
  uploadedBy: string;
  uploadedDate: string;
  expirationDate?: string;
  version: number;
  assureDocId?: string;
}

export interface PaymentConfiguration {
  method: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  remittanceAddress?: string;
  terms: PaymentTerms;
  currency: string;
  taxWithholding: boolean;
  requires1099: boolean;
}

export interface Vendor {
  id: string;
  legalName: string;
  dba?: string;
  status: VendorStatus;
  vendorType: VendorType;
  specialty?: string;
  tin: string;
  w9Status: 'PENDING' | 'RECEIVED' | 'EXPIRED';
  corporateAddress: Address;
  mailingAddress?: Address;
  serviceTerritory: string[];
  licenses: License[];
  contacts: VendorContact[];
  paymentConfig: PaymentConfiguration;
  documents: VendorDocument[];
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface License {
  id: string;
  licenseNumber: string;
  state: string;
  expirationDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface RateType {
  type: 'HOURLY' | 'TASK_BASED' | 'FLAT_FEE' | 'BLENDED';
  increment?: 'QUARTER_HOUR' | 'TENTH_HOUR';
}

export interface FeeSchedule {
  id: string;
  vendorId: string;
  scheduleName: string;
  serviceCode: string;
  serviceDescription: string;
  rateType: RateType;
  unitRate: number;
  effectiveDate: string;
  expirationDate?: string;
  version: number;
  approvedBy?: string;
  approvedDate?: string;
}
