import { useEffect, useState } from 'react';
import {
  DxcFlex,
  DxcTextInput,
  DxcSelect,
  DxcTextarea,
  DxcButton,
  DxcHeading,
  DxcTypography,
} from '@dxc-technology/halstack-react';
import { PageHeader, DataTable, StatusBadge, LoadingSpinner } from '@shared/components';
import { formatDate, formatDuration, formatCurrency } from '@shared/utils';
import { timeEntryService } from '../services/timeEntryService';
import { useTimeExpenseContext } from '../contexts/TimeExpenseContext';
import { TimerModal } from '../components/TimerModal';
import type { TimeEntry, ActivityCode, CaptureType } from '@shared/types';
import './TimeEntry.css';

export default function TimeEntryPage() {
  const { activeTimer, startTimer, stopTimer, currentAdjuster } = useTimeExpenseContext();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [activityCodes, setActivityCodes] = useState<ActivityCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Form state
  const [formData, setFormData] = useState({
    claimNumber: '',
    activityCodeId: '',
    duration: '',
    entryDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entriesData, codes] = await Promise.all([
        timeEntryService.getTimeEntries(),
        timeEntryService.getActivityCodes(),
      ]);
      setEntries(entriesData);
      setActivityCodes(codes);
    } catch (error) {
      console.error('Failed to load time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEntry = async () => {
    try {
      if (!currentAdjuster) {
        console.error('No adjuster selected');
        return;
      }

      const selectedActivity = activityCodes.find((a) => a.id === formData.activityCodeId);
      if (!selectedActivity) return;

      const duration = parseFloat(formData.duration);
      const rate = currentAdjuster.defaultRate;
      const amount = duration * rate;

      const newEntry: Partial<TimeEntry> = {
        claimNumber: formData.claimNumber,
        adjusterId: currentAdjuster.id,
        adjusterName: `${currentAdjuster.firstName} ${currentAdjuster.lastName}`,
        roleId: currentAdjuster.roleId,
        roleName: currentAdjuster.roleName,
        activityCodeId: formData.activityCodeId,
        activityCode: selectedActivity.code,
        activityDescription: selectedActivity.name,
        captureType: 'MANUAL' as CaptureType,
        entryDate: formData.entryDate,
        duration,
        rate,
        amount,
        status: 'PENDING',
        notes: formData.notes,
        createdBy: currentAdjuster.id,
        createdDate: new Date().toISOString(),
      };

      await timeEntryService.createTimeEntry(newEntry);

      // Reset form and reload
      setFormData({
        claimNumber: '',
        activityCodeId: '',
        duration: '',
        entryDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Failed to create time entry:', error);
    }
  };

  const handleTimerSave = async (data: {
    claimNumber: string;
    activityCodeId: string;
    duration: number;
    notes: string;
  }) => {
    try {
      if (!currentAdjuster) {
        console.error('No adjuster selected');
        return;
      }

      const selectedActivity = activityCodes.find((a) => a.id === data.activityCodeId);
      if (!selectedActivity) return;

      const rate = currentAdjuster.defaultRate;
      const amount = data.duration * rate;

      const newEntry: Partial<TimeEntry> = {
        claimNumber: data.claimNumber,
        adjusterId: currentAdjuster.id,
        adjusterName: `${currentAdjuster.firstName} ${currentAdjuster.lastName}`,
        roleId: currentAdjuster.roleId,
        roleName: currentAdjuster.roleName,
        activityCodeId: data.activityCodeId,
        activityCode: selectedActivity.code,
        activityDescription: selectedActivity.name,
        captureType: 'TIMER' as CaptureType,
        entryDate: new Date().toISOString().split('T')[0],
        duration: data.duration,
        rate,
        amount,
        status: 'PENDING',
        notes: data.notes,
        createdBy: currentAdjuster.id,
        createdDate: new Date().toISOString(),
      };

      await timeEntryService.createTimeEntry(newEntry);
      loadData();
    } catch (error) {
      console.error('Failed to create timer entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await timeEntryService.deleteTimeEntry(entryId);
      loadData();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const handleSubmitForBilling = async () => {
    try {
      const draftEntries = entries.filter((e) => e.status === 'PENDING');
      await timeEntryService.submitForBilling(draftEntries.map((e) => e.id));
      loadData();
    } catch (error) {
      console.error('Failed to submit for billing:', error);
    }
  };

  // Filter entries based on type
  const filteredEntries = typeFilter === 'ALL'
    ? entries
    : entries.filter((e) => e.captureType === typeFilter);

  if (loading) {
    return <LoadingSpinner text="Loading time entries..." />;
  }

  return (
    <div className="time-entry-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <DxcHeading level={1} text="Time Entry" />

        {/* Quick Stats */}
        <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
          <div className="stat-card">
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {entries.length}
              </DxcTypography>
              <DxcTypography
                fontSize="font-scale-02"
                color="var(--color-fg-neutral-stronger)"
              >
                Total Entries
              </DxcTypography>
            </DxcFlex>
          </div>

          <div className="stat-card">
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {entries.filter((e) => e.status === 'PENDING').length}
              </DxcTypography>
              <DxcTypography
                fontSize="font-scale-02"
                color="var(--color-fg-neutral-stronger)"
              >
                Pending Review
              </DxcTypography>
            </DxcFlex>
          </div>

          <div className="stat-card">
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {formatCurrency(entries.reduce((sum, e) => sum + e.amount, 0))}
              </DxcTypography>
              <DxcTypography
                fontSize="font-scale-02"
                color="var(--color-fg-neutral-stronger)"
              >
                Total Amount
              </DxcTypography>
            </DxcFlex>
          </div>
        </DxcFlex>

        {/* Action Buttons */}
        <DxcFlex gap="var(--spacing-gap-m)">
          <DxcButton
            label={showForm ? 'Cancel' : 'Manual Entry'}
            onClick={() => setShowForm(!showForm)}
            mode="primary"
            icon="edit"
          />
          <DxcButton
            label="Timer Entry"
            onClick={() => setShowTimerModal(true)}
            mode="primary"
            icon="timer"
          />
          <DxcButton
            label="Submit for Billing"
            onClick={handleSubmitForBilling}
            mode="secondary"
          />
        </DxcFlex>

        {/* Timer Widget */}
        {activeTimer && (
          <div className="timer-card">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <div>
                <DxcHeading level={4} text="Timer Running" />
                <DxcTypography fontSize="font-scale-03" color="#FFFFFF">
                  Claim: {activeTimer.claimNumber} • Elapsed: {formatDuration(activeTimer.elapsedSeconds / 3600)}
                </DxcTypography>
              </div>
              <DxcButton label="Stop Timer" onClick={stopTimer} mode="primary" />
            </DxcFlex>
          </div>
        )}

        {/* Entry Form */}
        {showForm && (
          <div className="time-entry-card">
            <DxcFlex direction="column" gap="var(--spacing-gap-l)">
              <DxcHeading level={3} text="New Time Entry" />

              <DxcTextInput
                label="Claim Number"
                value={formData.claimNumber}
                onChange={(value) => setFormData({ ...formData, claimNumber: value })}
                placeholder="CLM-2024-001234"
              />

              <DxcSelect
                label="Activity"
                options={activityCodes
                  .filter((a) => a.isActive && a.billable)
                  .map((a) => ({
                    label: `${a.code} - ${a.name}`,
                    value: a.id,
                  }))}
                value={formData.activityCodeId}
                onChange={(value) => setFormData({ ...formData, activityCodeId: value })}
              />

              <DxcTextInput
                label="Duration (hours)"
                value={formData.duration}
                onChange={(value) => setFormData({ ...formData, duration: value })}
                placeholder="2.5"
              />

              {formData.duration && currentAdjuster && (
                <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                  <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-stronger)">
                    Estimated Amount:
                  </DxcTypography>
                  <DxcTypography
                    fontSize="font-scale-03"
                    fontWeight="font-weight-semibold"
                    color="var(--color-blue-600)"
                  >
                    {formatCurrency(parseFloat(formData.duration || '0') * currentAdjuster.defaultRate)}
                  </DxcTypography>
                  <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-strong)">
                    ({formatDuration(parseFloat(formData.duration || '0'))} × {formatCurrency(currentAdjuster.defaultRate)}/hr)
                  </DxcTypography>
                </DxcFlex>
              )}

              <DxcTextInput
                label="Date"
                value={formData.entryDate}
                onChange={(value) => setFormData({ ...formData, entryDate: value })}
                type="date"
              />

              <DxcTextarea
                label="Notes"
                value={formData.notes}
                onChange={(value) => setFormData({ ...formData, notes: value })}
                placeholder="Description of work performed..."
              />

              <DxcFlex gap="var(--spacing-gap-m)">
                <DxcButton label="Save Entry" onClick={handleSubmitEntry} mode="primary" />
                <DxcButton
                  label="Cancel"
                  onClick={() => setShowForm(false)}
                  mode="secondary"
                />
              </DxcFlex>
            </DxcFlex>
          </div>
        )}

        {/* Entries Table */}
        <div className="time-entry-card">
          <DxcFlex direction="column" gap="var(--spacing-gap-l)">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <DxcHeading level={3} text="Time Entries" />
              <DxcSelect
                label="Filter by Type"
                options={[
                  { label: 'All Types', value: 'ALL' },
                  { label: '✏️ Manual Only', value: 'MANUAL' },
                  { label: '⏱️ Timer Only', value: 'TIMER' },
                  { label: '⚡ Auto Events Only', value: 'AUTO' },
                ]}
                value={typeFilter}
                onChange={(value) => setTypeFilter(value)}
                size="small"
              />
            </DxcFlex>

            <DataTable
              columns={[
                {
                  key: 'captureType',
                  header: 'Type',
                  render: (row) => {
                    const icons = {
                      MANUAL: '✏️',
                      TIMER: '⏱️',
                      AUTO: '⚡',
                    };
                    return (
                      <span style={{ fontSize: '20px' }} title={row.captureType}>
                        {icons[row.captureType]}
                      </span>
                    );
                  },
                },
                {
                  key: 'entryDate',
                  header: 'Date',
                  render: (row) => formatDate(row.entryDate),
                },
                { key: 'claimNumber', header: 'Claim #' },
                { key: 'activityDescription', header: 'Activity' },
                {
                  key: 'duration',
                  header: 'Duration',
                  render: (row) => formatDuration(row.duration),
                },
                {
                  key: 'rate',
                  header: 'Rate',
                  render: (row) => formatCurrency(row.rate),
                },
                {
                  key: 'amount',
                  header: 'Amount',
                  render: (row) => formatCurrency(row.amount),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => <StatusBadge status={row.status} />,
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  render: (row) =>
                    row.status === 'PENDING' ? (
                      <DxcButton
                        label="Delete"
                        mode="text"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(row.id);
                        }}
                      />
                    ) : null,
                },
              ]}
              data={filteredEntries}
              emptyMessage={
                typeFilter === 'ALL'
                  ? 'No time entries found'
                  : `No ${typeFilter.toLowerCase()} entries found`
              }
            />
          </DxcFlex>
        </div>

        {/* Timer Modal */}
        <TimerModal
          isOpen={showTimerModal}
          onClose={() => setShowTimerModal(false)}
          activityCodes={activityCodes}
          claimNumber={formData.claimNumber || 'CLM-2024-001234'}
          onSave={handleTimerSave}
        />
      </DxcFlex>
    </div>
  );
}
