import { apiClient } from '@shared/utils/api-client';
import type { Vendor, ApiResponse, PaginatedResponse } from '@shared/types';

export const vendorService = {
  /**
   * Get all vendors
   */
  async getVendors(params?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<Vendor[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const response = await apiClient.get<ApiResponse<Vendor[]>>(
      `/vendors?${queryParams.toString()}`
    );
    return response.data || [];
  },

  /**
   * Get vendor by ID
   */
  async getVendor(vendorId: string): Promise<Vendor> {
    const response = await apiClient.get<ApiResponse<Vendor>>(`/vendors/${vendorId}`);
    if (!response.data) throw new Error('Vendor not found');
    return response.data;
  },

  /**
   * Create new vendor
   */
  async createVendor(vendor: Partial<Vendor>): Promise<Vendor> {
    const response = await apiClient.post<ApiResponse<Vendor>>('/vendors', vendor);
    if (!response.data) throw new Error('Failed to create vendor');
    return response.data;
  },

  /**
   * Update vendor
   */
  async updateVendor(vendorId: string, updates: Partial<Vendor>): Promise<Vendor> {
    const response = await apiClient.patch<ApiResponse<Vendor>>(
      `/vendors/${vendorId}`,
      updates
    );
    if (!response.data) throw new Error('Failed to update vendor');
    return response.data;
  },

  /**
   * Get vendor statistics
   */
  async getVendorStats(): Promise<{
    totalActive: number;
    totalInactive: number;
    pendingOnboarding: number;
    totalReferrals: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/vendors/stats');
    return response.data || {
      totalActive: 0,
      totalInactive: 0,
      pendingOnboarding: 0,
      totalReferrals: 0,
    };
  },
};
