import { apiClient } from '@shared/utils/api-client';
import type { TimeEntry, ActivityCode, ApiResponse } from '@shared/types';

export const timeEntryService = {
  /**
   * Get all time entries
   */
  async getTimeEntries(params?: {
    claimNumber?: string;
    adjusterId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TimeEntry[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const response = await apiClient.get<ApiResponse<TimeEntry[]>>(
      `/time-entries?${queryParams.toString()}`
    );
    return response.data || [];
  },

  /**
   * Create time entry
   */
  async createTimeEntry(entry: Partial<TimeEntry>): Promise<TimeEntry> {
    const response = await apiClient.post<ApiResponse<TimeEntry>>('/time-entries', entry);
    if (!response.data) throw new Error('Failed to create time entry');
    return response.data;
  },

  /**
   * Update time entry
   */
  async updateTimeEntry(entryId: string, updates: Partial<TimeEntry>): Promise<TimeEntry> {
    const response = await apiClient.patch<ApiResponse<TimeEntry>>(
      `/time-entries/${entryId}`,
      updates
    );
    if (!response.data) throw new Error('Failed to update time entry');
    return response.data;
  },

  /**
   * Delete time entry
   */
  async deleteTimeEntry(entryId: string): Promise<void> {
    await apiClient.delete(`/time-entries/${entryId}`);
  },

  /**
   * Submit time entries for billing
   */
  async submitForBilling(entryIds: string[]): Promise<void> {
    await apiClient.post('/time-entries/submit', { entryIds });
  },

  /**
   * Get activity codes
   */
  async getActivityCodes(): Promise<ActivityCode[]> {
    const response = await apiClient.get<ApiResponse<ActivityCode[]>>('/activity-codes');
    return response.data || [];
  },

  /**
   * Get time entry statistics
   */
  async getTimeEntryStats(adjusterId?: string): Promise<{
    todayHours: number;
    weekHours: number;
    monthHours: number;
    pendingEntries: number;
    autoCaptured: number;
  }> {
    const params = adjusterId ? `?adjusterId=${adjusterId}` : '';
    const response = await apiClient.get<ApiResponse<any>>(`/time-entries/stats${params}`);
    return response.data || {
      todayHours: 0,
      weekHours: 0,
      monthHours: 0,
      pendingEntries: 0,
      autoCaptured: 0,
    };
  },
};
