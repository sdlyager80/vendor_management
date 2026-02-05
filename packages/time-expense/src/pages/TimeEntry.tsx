import { useEffect, useState } from 'react';
import {
  DxcFlex,
  DxcCard,
  DxcTextInput,
  DxcSelect,
  DxcTextarea,
  DxcButton,
  DxcHeading,
} from '@dxc-technology/halstack-react';
import { PageHeader, DataTable, StatusBadge, LoadingSpinner } from '@shared/components';
import { formatDate, formatDuration, formatCurrency } from '@shared/utils';
import { timeEntryService } from '../services/timeEntryService';
import { useTimeExpenseContext } from '../contexts/TimeExpenseContext';
import type { TimeEntry, ActivityCode, CaptureType } from '@shared/types';

export default function TimeEntryPage() {
  const { activeTimer, startTimer, stopTimer } = useTimeExpenseContext();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [activityCodes, setActivityCodes] = useState<ActivityCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
      const selectedActivity = activityCodes.find((a) => a.id === formData.activityCodeId);
      if (!selectedActivity) return;

      const newEntry: Partial<TimeEntry> = {
        claimNumber: formData.claimNumber,
        adjusterId: 'ADJ-001', // TODO: Get from auth context
        adjusterName: 'Current User',
        roleId: 'ROLE-001',
        roleName: 'Senior Adjuster',
        activityCodeId: formData.activityCodeId,
        activityCode: selectedActivity.code,
        activityDescription: selectedActivity.name,
        captureType: 'MANUAL' as CaptureType,
        entryDate: formData.entryDate,
        duration: parseFloat(formData.duration),
        rate: 125, // TODO: Get from role/carrier config
        amount: parseFloat(formData.duration) * 125,
        status: 'DRAFT',
        notes: formData.notes,
        createdBy: 'ADJ-001',
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
      const draftEntries = entries.filter((e) => e.status === 'DRAFT');
      await timeEntryService.submitForBilling(draftEntries.map((e) => e.id));
      loadData();
    } catch (error) {
      console.error('Failed to submit for billing:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading time entries..." />;
  }

  return (
    <DxcFlex direction="column" gap="1.5rem" style={{ padding: '2rem' }}>
      <PageHeader
        title="Time Entry"
        subtitle={`${entries.length} entries`}
        actions={[
          {
            label: showForm ? 'Cancel' : 'New Entry',
            onClick: () => setShowForm(!showForm),
            mode: 'primary',
          },
          {
            label: 'Submit for Billing',
            onClick: handleSubmitForBilling,
            mode: 'secondary',
          },
        ]}
      />

      {/* Timer Widget */}
      {activeTimer && (
        <DxcCard style={{ padding: '1.5rem', backgroundColor: '#E6F4FF' }}>
          <DxcFlex justifyContent="space-between" alignItems="center">
            <div>
              <DxcHeading level={4} text="Timer Running" />
              <p style={{ margin: 0 }}>
                Claim: {activeTimer.claimNumber} • Elapsed: {formatDuration(activeTimer.elapsedSeconds / 3600)}
              </p>
            </div>
            <DxcButton label="Stop Timer" onClick={stopTimer} mode="primary" />
          </DxcFlex>
        </DxcCard>
      )}

      {/* Entry Form */}
      {showForm && (
        <DxcCard style={{ padding: '1.5rem' }}>
          <DxcHeading level={3} text="New Time Entry" />

          <DxcFlex direction="column" gap="1rem" style={{ marginTop: '1rem' }}>
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

            <DxcFlex gap="0.75rem">
              <DxcButton label="Save Entry" onClick={handleSubmitEntry} mode="primary" />
              <DxcButton
                label="Cancel"
                onClick={() => setShowForm(false)}
                mode="secondary"
              />
            </DxcFlex>
          </DxcFlex>
        </DxcCard>
      )}

      {/* Entries Table */}
      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcHeading level={3} text="Time Entries" />

        <DataTable
          columns={[
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
                row.status === 'DRAFT' ? (
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
          data={entries}
          emptyMessage="No time entries found"
        />
      </DxcCard>
    </DxcFlex>
  );
}
