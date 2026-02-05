import { apiClient } from '@shared/utils/api-client';
import type { ExpenseEntry, ExpenseType, ApiResponse } from '@shared/types';

export const expenseService = {
  /**
   * Get all expense entries
   */
  async getExpenseEntries(params?: {
    claimNumber?: string;
    adjusterId?: string;
    status?: string;
  }): Promise<ExpenseEntry[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const response = await apiClient.get<ApiResponse<ExpenseEntry[]>>(
      `/expense-entries?${queryParams.toString()}`
    );
    return response.data || [];
  },

  /**
   * Create expense entry
   */
  async createExpenseEntry(entry: Partial<ExpenseEntry>): Promise<ExpenseEntry> {
    const response = await apiClient.post<ApiResponse<ExpenseEntry>>('/expense-entries', entry);
    if (!response.data) throw new Error('Failed to create expense entry');
    return response.data;
  },

  /**
   * Update expense entry
   */
  async updateExpenseEntry(
    entryId: string,
    updates: Partial<ExpenseEntry>
  ): Promise<ExpenseEntry> {
    const response = await apiClient.patch<ApiResponse<ExpenseEntry>>(
      `/expense-entries/${entryId}`,
      updates
    );
    if (!response.data) throw new Error('Failed to update expense entry');
    return response.data;
  },

  /**
   * Delete expense entry
   */
  async deleteExpenseEntry(entryId: string): Promise<void> {
    await apiClient.delete(`/expense-entries/${entryId}`);
  },

  /**
   * Get expense types
   */
  async getExpenseTypes(): Promise<ExpenseType[]> {
    const response = await apiClient.get<ApiResponse<ExpenseType[]>>('/expense-types');
    return response.data || [];
  },
};
