import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DxcFlex, DxcSelect } from '@dxc-technology/halstack-react';
import { PageHeader, DataTable, StatusBadge } from '@shared/components';
import { formatDate } from '@shared/utils';
import { referralService } from '../services/referralService';
import type { Referral } from '@shared/types';

export default function ReferralList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    loadReferrals();
  }, [statusFilter]);

  const loadReferrals = async () => {
    try {
      setLoading(true);
      const data = await referralService.getReferrals({
        status: statusFilter || undefined,
      });
      setReferrals(data);
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <PageHeader
          title="Referrals"
          subtitle={`${referrals.length} referrals`}
          actions={[
            {
              label: 'Create Referral',
              onClick: () => navigate('/referrals/new'),
              mode: 'primary',
            },
          ]}
        />

        {/* Filters */}
        <DxcFlex gap="var(--spacing-gap-m)" alignItems="flex-end">
          <div style={{ width: '200px' }}>
            <DxcSelect
              label="Status"
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Assigned', value: 'ASSIGNED' },
                { label: 'Accepted', value: 'ACCEPTED' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'Complete', value: 'COMPLETE' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            />
          </div>
        </DxcFlex>

        {/* Referrals Table */}
        <DataTable
          columns={[
            { key: 'referralNumber', header: 'Referral #', width: '140px' },
            { key: 'claimNumber', header: 'Claim #', width: '140px' },
            { key: 'claimantName', header: 'Claimant' },
            { key: 'vendorName', header: 'Vendor' },
            { key: 'serviceType', header: 'Service' },
            {
              key: 'assignedDate',
              header: 'Assigned',
              render: (row) => formatDate(row.assignedDate),
            },
            {
              key: 'dueDate',
              header: 'Due Date',
              render: (row) => (row.dueDate ? formatDate(row.dueDate) : '-'),
            },
            {
              key: 'status',
              header: 'Status',
              width: '150px',
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: 'slaBreach',
              header: 'SLA',
              width: '80px',
              render: (row) =>
                row.slaBreach ? (
                  <span style={{ color: 'var(--color-red-600)', fontWeight: 'var(--font-weight-semibold)' }}>⚠ Breach</span>
                ) : (
                  <span style={{ color: 'var(--color-blue-600)' }}>✓ OK</span>
                ),
            },
          ]}
          data={referrals}
          loading={loading}
          onRowClick={(referral) => navigate(`/referrals/${referral.id}`)}
          emptyMessage="No referrals found"
        />
      </DxcFlex>
    </div>
  );
}
