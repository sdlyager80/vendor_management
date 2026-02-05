import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { TimeEntry, ExpenseEntry, ClaimContext, TimerSession, Adjuster } from '@shared/types';
import { adjusterService } from '../services/adjusterService';

interface TimeExpenseContextType {
  timeEntries: TimeEntry[];
  expenseEntries: ExpenseEntry[];
  claimContext: ClaimContext | null;
  activeTimer: TimerSession | null;
  currentAdjuster: Adjuster | null;
  adjusters: Adjuster[];
  setCurrentAdjuster: (adjuster: Adjuster) => void;
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
  const [currentAdjuster, setCurrentAdjuster] = useState<Adjuster | null>(null);
  const [adjusters, setAdjusters] = useState<Adjuster[]>([]);

  // Load adjusters on mount
  useEffect(() => {
    const loadAdjusters = async () => {
      try {
        const data = await adjusterService.getAdjusters();
        setAdjusters(data);
        // Set first adjuster as default (Sarah Johnson - Senior Adjuster)
        if (data.length > 0) {
          setCurrentAdjuster(data[0]);
        }
      } catch (error) {
        console.error('Failed to load adjusters:', error);
      }
    };
    loadAdjusters();
  }, []);

  const startTimer = useCallback((claimNumber: string, activityCodeId: string) => {
    if (!currentAdjuster) {
      console.error('No adjuster selected');
      return;
    }
    const newTimer: TimerSession = {
      id: `TIMER-${Date.now()}`,
      claimNumber,
      adjusterId: currentAdjuster.id,
      activityCodeId,
      startTime: new Date().toISOString(),
      elapsedSeconds: 0,
      isActive: true,
    };
    setActiveTimer(newTimer);
  }, [currentAdjuster]);

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
        currentAdjuster,
        adjusters,
        setCurrentAdjuster,
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
