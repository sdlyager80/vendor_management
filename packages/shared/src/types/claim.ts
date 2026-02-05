/**
 * Claim Context Types (from Assure Claims)
 */

export enum ClaimStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  REOPENED = 'REOPENED',
}

export enum ClaimType {
  WORKERS_COMP = 'WORKERS_COMP',
  AUTO_LIABILITY = 'AUTO_LIABILITY',
  PROPERTY = 'PROPERTY',
  GENERAL_LIABILITY = 'GENERAL_LIABILITY',
  PROFESSIONAL_LIABILITY = 'PROFESSIONAL_LIABILITY',
}

export enum ReserveType {
  MEDICAL = 'MEDICAL',
  INDEMNITY = 'INDEMNITY',
  EXPENSE = 'EXPENSE',
  LEGAL = 'LEGAL',
}

export interface ClaimParty {
  partyId: string;
  partyType: 'CLAIMANT' | 'INSURED' | 'WITNESS' | 'ATTORNEY';
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  phone?: string;
  email?: string;
}

export interface InjuryInfo {
  description: string;
  bodyParts: string[];
  treatmentStatus: 'ONGOING' | 'COMPLETED' | 'NOT_STARTED';
  returnToWorkDate?: string;
}

export interface ClaimHandler {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface Reserve {
  reserveType: ReserveType;
  amount: number;
  paid: number;
  outstanding: number;
  lastUpdated: string;
}

export interface ClaimContext {
  claimNumber: string;
  claimStatus: ClaimStatus;
  dateOfLoss: string;
  claimType: ClaimType;
  claimant: ClaimParty;
  insured?: ClaimParty;
  handler: ClaimHandler;
  injury?: InjuryInfo;
  reserves: Reserve[];
  carrierId?: string;
  carrierName?: string;
  policyNumber?: string;
}
