import { apiClient } from '@shared/utils/api-client';
import type { Invoice, ApiResponse } from '@shared/types';

export const invoiceService = {
  /**
   * Get all invoices
   */
  async getInvoices(params?: {
    status?: string;
    vendorId?: string;
    claimNumber?: string;
  }): Promise<Invoice[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const response = await apiClient.get<ApiResponse<Invoice[]>>(
      `/invoices?${queryParams.toString()}`
    );
    return response.data || [];
  },

  /**
   * Get invoice by ID
   */
  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${invoiceId}`);
    if (!response.data) throw new Error('Invoice not found');
    return response.data;
  },

  /**
   * Submit invoice
   */
  async submitInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await apiClient.post<ApiResponse<Invoice>>('/invoices', invoice);
    if (!response.data) throw new Error('Failed to submit invoice');
    return response.data;
  },

  /**
   * Approve invoice
   */
  async approveInvoice(invoiceId: string, approvedAmount?: number): Promise<Invoice> {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      `/invoices/${invoiceId}/approve`,
      { approvedAmount }
    );
    if (!response.data) throw new Error('Failed to approve invoice');
    return response.data;
  },

  /**
   * Reject invoice
   */
  async rejectInvoice(invoiceId: string, reason: string): Promise<Invoice> {
    const response = await apiClient.post<ApiResponse<Invoice>>(
      `/invoices/${invoiceId}/reject`,
      { reason }
    );
    if (!response.data) throw new Error('Failed to reject invoice');
    return response.data;
  },

  /**
   * Get invoice statistics
   */
  async getInvoiceStats(): Promise<{
    totalPending: number;
    totalApproved: number;
    totalPaid: number;
    totalAmount: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/invoices/stats');
    return response.data || {
      totalPending: 0,
      totalApproved: 0,
      totalPaid: 0,
      totalAmount: 0,
    };
  },
};
