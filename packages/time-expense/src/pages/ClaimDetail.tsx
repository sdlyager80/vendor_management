import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DxcFlex,
  DxcHeading,
  DxcTypography,
  DxcButton,
} from '@dxc-technology/halstack-react';
import { DataTable, StatusBadge, LoadingSpinner } from '@shared/components';
import { formatDate, formatCurrency, formatDuration } from '@shared/utils';
import { claimService } from '../services/claimService';
import { AssureClaimsPanel } from '../components/AssureClaimsPanel';
import type { TimeEntry, ExpenseEntry, AssureClaimsEvent } from '@shared/types';

interface ClaimDetail {
  claimNumber: string;
  claimantName: string;
  carrierName: string;
  claimType: string;
  claimStatus: string;
  dateOfLoss: string;
  adjusterName: string;
  timeEntries: TimeEntry[];
  expenseEntries: ExpenseEntry[];
  events: AssureClaimsEvent[];
  billingSummary: {
    totalHours: number;
    totalAmount: number;
    totalExpenses: number;
    autoCapturedPercentage: number;
    pendingAmount: number;
  };
}

export default function ClaimDetailPage() {
  const { claimNumber } = useParams<{ claimNumber: string }>();
  const navigate = useNavigate();
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (claimNumber) {
      loadClaimDetail();
    }
  }, [claimNumber]);

  const loadClaimDetail = async () => {
    if (!claimNumber) return;

    try {
      setLoading(true);
      const data = await claimService.getClaim(claimNumber);
      setClaim(data);
    } catch (error) {
      console.error('Failed to load claim detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading claim details..." />;
  }

  if (!claim) {
    return (
      <div className="time-entry-container">
        <DxcTypography>Claim not found</DxcTypography>
      </div>
    );
  }

  return (
    <div className="time-entry-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        {/* Claim Header */}
        <DxcFlex justifyContent="space-between" alignItems="flex-start">
          <div>
            <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
              <DxcHeading level={1} text={claim.claimNumber} />
              <StatusBadge status={claim.claimStatus} />
            </DxcFlex>
            <DxcTypography fontSize="font-scale-03" style={{ marginTop: '8px' }}>
              {claim.claimantName}
            </DxcTypography>
            <DxcFlex gap="var(--spacing-gap-m)" style={{ marginTop: '8px' }}>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Carrier: {claim.carrierName}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Type: {claim.claimType.replace('_', ' ')}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Adjuster: {claim.adjusterName}
              </DxcTypography>
            </DxcFlex>
          </div>
          <DxcButton
            label="Back to Claims"
            onClick={() => navigate('/claims')}
            mode="secondary"
            icon="arrow_back"
          />
        </DxcFlex>

        {/* Billing Summary Cards */}
        <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
          {/* Total Hours Card */}
          <div className="stat-card" style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Total Hours
              </DxcTypography>
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {formatDuration(claim.billingSummary.totalHours)}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-strong)">
                {claim.timeEntries.length} entries
              </DxcTypography>
            </DxcFlex>
          </div>

          {/* Amount Billed Card */}
          <div className="stat-card" style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Amount Billed
              </DxcTypography>
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {formatCurrency(claim.billingSummary.totalAmount)}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-strong)">
                {formatCurrency(claim.billingSummary.pendingAmount)} pending
              </DxcTypography>
            </DxcFlex>
          </div>

          {/* Auto-Captured Card */}
          <div className="stat-card" style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Auto-Captured
              </DxcTypography>
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {claim.billingSummary.autoCapturedPercentage.toFixed(0)}%
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-strong)">
                of entries
              </DxcTypography>
            </DxcFlex>
          </div>

          {/* Expenses Card */}
          <div className="stat-card" style={{ flex: '1 1 calc(25% - 16px)', minWidth: '200px' }}>
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-strong)">
                Expenses
              </DxcTypography>
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {formatCurrency(claim.billingSummary.totalExpenses)}
              </DxcTypography>
              <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-strong)">
                {claim.expenseEntries.length} items
              </DxcTypography>
            </DxcFlex>
          </div>
        </DxcFlex>

        {/* Assure Claims Integration Panel */}
        {claim.events && claim.events.length > 0 && (
          <AssureClaimsPanel claimNumber={claim.claimNumber} events={claim.events} />
        )}

        {/* Time & Billing Entries */}
        <div className="time-entry-card">
          <DxcFlex direction="column" gap="var(--spacing-gap-l)">
            <DxcHeading level={3} text="Time & Billing Entries" />

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
                { key: 'activityDescription', header: 'Activity' },
                { key: 'adjusterName', header: 'Adjuster' },
                { key: 'roleName', header: 'Role' },
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
              ]}
              data={claim.timeEntries}
              emptyMessage="No time entries for this claim"
            />
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
}
