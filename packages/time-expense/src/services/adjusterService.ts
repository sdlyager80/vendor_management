import type { Adjuster } from '@shared/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const adjusterService = {
  /**
   * Get all adjusters
   */
  async getAdjusters(): Promise<Adjuster[]> {
    const response = await fetch(`${API_BASE}/adjusters`);
    if (!response.ok) {
      throw new Error('Failed to fetch adjusters');
    }
    const result = await response.json();
    return result.data;
  },

  /**
   * Get single adjuster by ID
   */
  async getAdjuster(id: string): Promise<Adjuster> {
    const response = await fetch(`${API_BASE}/adjusters/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch adjuster');
    }
    const result = await response.json();
    return result.data;
  },
};
