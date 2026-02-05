import { useState, useEffect } from 'react';
import {
  DxcDialog,
  DxcFlex,
  DxcTypography,
  DxcButton,
  DxcSelect,
  DxcTextInput,
  DxcTextarea,
} from '@dxc-technology/halstack-react';
import { formatCurrency } from '@shared/utils';
import type { ActivityCode } from '@shared/types';
import { useTimeExpenseContext } from '../contexts/TimeExpenseContext';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityCodes: ActivityCode[];
  claimNumber: string;
  onSave: (data: {
    claimNumber: string;
    activityCodeId: string;
    duration: number;
    notes: string;
  }) => Promise<void>;
}

export function TimerModal({
  isOpen,
  onClose,
  activityCodes,
  claimNumber,
  onSave,
}: TimerModalProps) {
  const { currentAdjuster } = useTimeExpenseContext();
  const [activityCodeId, setActivityCodeId] = useState('');
  const [notes, setNotes] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(elapsed);
      }, 100); // Update every 100ms for smooth display
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!activityCodeId) {
      alert('Please select an activity first');
      return;
    }
    setStartTime(Date.now() - elapsedSeconds * 1000);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    setStartTime(Date.now() - elapsedSeconds * 1000);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setStartTime(null);
  };

  const handleSave = async () => {
    if (!activityCodeId || elapsedSeconds === 0) {
      alert('Please select an activity and run the timer');
      return;
    }

    const durationHours = elapsedSeconds / 3600;

    await onSave({
      claimNumber,
      activityCodeId,
      duration: durationHours,
      notes,
    });

    // Reset and close
    handleReset();
    setActivityCodeId('');
    setNotes('');
    onClose();
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateAmount = (): number => {
    if (!currentAdjuster) return 0;
    const hours = elapsedSeconds / 3600;
    return hours * currentAdjuster.defaultRate;
  };

  return (
    <DxcDialog isCloseVisible onCloseClick={onClose} overlay isVisible={isOpen}>
      <DxcFlex direction="column" gap="var(--spacing-gap-l)" style={{ padding: '24px', minWidth: '500px' }}>
        {/* Header */}
        <DxcFlex direction="column" gap="var(--spacing-gap-s)">
          <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-semibold">
            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>
              timer
            </span>
            Timer Entry
          </DxcTypography>
          <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-strong)">
            Claim: {claimNumber}
          </DxcTypography>
        </DxcFlex>

        {/* Timer Display */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4DD0E1 0%, #0095FF 100%)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <DxcTypography
            fontSize="48px"
            fontWeight="font-weight-semibold"
            color="#FFFFFF"
            style={{ fontFamily: 'monospace', letterSpacing: '4px' }}
          >
            {formatTime(elapsedSeconds)}
          </DxcTypography>

          {currentAdjuster && (
            <DxcFlex direction="column" gap="var(--spacing-gap-xs)" style={{ marginTop: '16px' }}>
              <DxcTypography fontSize="font-scale-02" color="rgba(255, 255, 255, 0.9)">
                {(elapsedSeconds / 3600).toFixed(2)} hours × {formatCurrency(currentAdjuster.defaultRate)}/hr
              </DxcTypography>
              <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-semibold" color="#FFFFFF">
                {formatCurrency(calculateAmount())}
              </DxcTypography>
            </DxcFlex>
          )}
        </div>

        {/* Timer Controls */}
        <DxcFlex gap="var(--spacing-gap-m)" justifyContent="center">
          {!isRunning && elapsedSeconds === 0 && (
            <DxcButton label="Start Timer" onClick={handleStart} mode="primary" icon="play_arrow" />
          )}
          {isRunning && (
            <DxcButton label="Pause" onClick={handlePause} mode="secondary" icon="pause" />
          )}
          {!isRunning && elapsedSeconds > 0 && (
            <>
              <DxcButton label="Resume" onClick={handleResume} mode="primary" icon="play_arrow" />
              <DxcButton label="Reset" onClick={handleReset} mode="text" icon="refresh" />
            </>
          )}
        </DxcFlex>

        {/* Activity Selection */}
        <DxcSelect
          label="Activity"
          options={activityCodes
            .filter((a) => a.isActive && a.billable)
            .map((a) => ({
              label: `${a.code} - ${a.name}`,
              value: a.id,
            }))}
          value={activityCodeId}
          onChange={(value) => setActivityCodeId(value)}
          disabled={isRunning}
        />

        {/* Notes */}
        <DxcTextarea
          label="Notes"
          value={notes}
          onChange={(value) => setNotes(value)}
          placeholder="Description of work performed..."
          rows={3}
        />

        {/* Action Buttons */}
        <DxcFlex gap="var(--spacing-gap-m)" justifyContent="flex-end">
          <DxcButton label="Cancel" onClick={onClose} mode="text" />
          <DxcButton
            label="Save Entry"
            onClick={handleSave}
            mode="primary"
            disabled={!activityCodeId || elapsedSeconds === 0}
          />
        </DxcFlex>
      </DxcFlex>
    </DxcDialog>
  );
}
