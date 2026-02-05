import { apiClient } from '@shared/utils/api-client';
import type { Referral, ApiResponse, ClaimContext } from '@shared/types';

export const referralService = {
  /**
   * Get all referrals
   */
  async getReferrals(params?: {
    status?: string;
    vendorId?: string;
    claimNumber?: string;
  }): Promise<Referral[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const response = await apiClient.get<ApiResponse<Referral[]>>(
      `/referrals?${queryParams.toString()}`
    );
    return response.data || [];
  },

  /**
   * Get referral by ID
   */
  async getReferral(referralId: string): Promise<Referral> {
    const response = await apiClient.get<ApiResponse<Referral>>(`/referrals/${referralId}`);
    if (!response.data) throw new Error('Referral not found');
    return response.data;
  },

  /**
   * Create new referral
   */
  async createReferral(referral: Partial<Referral>): Promise<Referral> {
    const response = await apiClient.post<ApiResponse<Referral>>('/referrals', referral);
    if (!response.data) throw new Error('Failed to create referral');
    return response.data;
  },

  /**
   * Update referral status
   */
  async updateReferralStatus(
    referralId: string,
    status: string,
    notes?: string
  ): Promise<Referral> {
    const response = await apiClient.patch<ApiResponse<Referral>>(
      `/referrals/${referralId}/status`,
      { status, notes }
    );
    if (!response.data) throw new Error('Failed to update referral');
    return response.data;
  },

  /**
   * Get claim context from Assure Claims
   */
  async getClaimContext(claimNumber: string): Promise<ClaimContext> {
    const response = await apiClient.get<ApiResponse<ClaimContext>>(
      `/assure/claims/${claimNumber}/context`
    );
    if (!response.data) throw new Error('Claim not found');
    return response.data;
  },

  /**
   * Get referral statistics
   */
  async getReferralStats(): Promise<{
    totalOpen: number;
    totalCompleted: number;
    slaBreaches: number;
    avgCompletionTime: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/referrals/stats');
    return response.data || {
      totalOpen: 0,
      totalCompleted: 0,
      slaBreaches: 0,
      avgCompletionTime: 0,
    };
  },
};
