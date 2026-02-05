/**
 * Shared Types Index
 */

export * from './vendor';
export * from './referral';
export * from './invoice';
export * from './time-expense';
export * from './claim';

// Common API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMetadata {
  timestamp: string;
  requestId: string;
  page?: number;
  pageSize?: number;
  totalCount?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
