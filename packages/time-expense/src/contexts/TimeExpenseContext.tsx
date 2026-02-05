import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TimeEntry, ExpenseEntry, ClaimContext, TimerSession } from '@shared/types';

interface TimeExpenseContextType {
  timeEntries: TimeEntry[];
  expenseEntries: ExpenseEntry[];
  claimContext: ClaimContext | null;
  activeTimer: TimerSession | null;
  setClaimContext: (context: ClaimContext | null) => void;
  startTimer: (claimNumber: string, activityCodeId: string) => void;
  stopTimer: () => void;
  refreshTimeEntries: () => Promise<void>;
  refreshExpenseEntries: () => Promise<void>;
}

const TimeExpenseContext = createContext<TimeExpenseContextType | undefined>(undefined);

export function TimeExpenseProvider({ children }: { children: ReactNode }) {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [claimContext, setClaimContext] = useState<ClaimContext | null>(null);
  const [activeTimer, setActiveTimer] = useState<TimerSession | null>(null);

  const startTimer = useCallback((claimNumber: string, activityCodeId: string) => {
    const newTimer: TimerSession = {
      id: `TIMER-${Date.now()}`,
      claimNumber,
      adjusterId: 'ADJ-001', // TODO: Get from auth context
      activityCodeId,
      startTime: new Date().toISOString(),
      elapsedSeconds: 0,
      isActive: true,
    };
    setActiveTimer(newTimer);
  }, []);

  const stopTimer = useCallback(() => {
    if (activeTimer) {
      // TODO: Save time entry
      setActiveTimer(null);
    }
  }, [activeTimer]);

  const refreshTimeEntries = useCallback(async () => {
    // TODO: Implement API call to fetch time entries
    console.log('Refreshing time entries...');
  }, []);

  const refreshExpenseEntries = useCallback(async () => {
    // TODO: Implement API call to fetch expense entries
    console.log('Refreshing expense entries...');
  }, []);

  return (
    <TimeExpenseContext.Provider
      value={{
        timeEntries,
        expenseEntries,
        claimContext,
        activeTimer,
        setClaimContext,
        startTimer,
        stopTimer,
        refreshTimeEntries,
        refreshExpenseEntries,
      }}
    >
      {children}
    </TimeExpenseContext.Provider>
  );
}

export function useTimeExpenseContext() {
  const context = useContext(TimeExpenseContext);
  if (context === undefined) {
    throw new Error('useTimeExpenseContext must be used within a TimeExpenseProvider');
  }
  return context;
}
