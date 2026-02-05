import type { Claim } from '@shared/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const claimService = {
  /**
   * Get all claims
   */
  async getClaims(filters?: {
    status?: string;
    adjusterId?: string;
    carrierName?: string;
  }): Promise<Claim[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.adjusterId) params.append('adjusterId', filters.adjusterId);
    if (filters?.carrierName) params.append('carrierName', filters.carrierName);

    const url = `${API_BASE}/claims${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch claims');
    }
    const result = await response.json();
    return result.data;
  },

  /**
   * Get single claim with full details
   */
  async getClaim(claimNumber: string): Promise<any> {
    const response = await fetch(`${API_BASE}/claims/${claimNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch claim');
    }
    const result = await response.json();
    return result.data;
  },
};
