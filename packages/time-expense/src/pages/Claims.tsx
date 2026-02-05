import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DxcFlex,
  DxcHeading,
  DxcTextInput,
  DxcSelect,
  DxcTypography,
} from '@dxc-technology/halstack-react';
import { DataTable, StatusBadge, LoadingSpinner } from '@shared/components';
import { formatDate, formatCurrency, formatDuration } from '@shared/utils';
import { claimService } from '../services/claimService';
import type { Claim } from '@shared/types';

export default function ClaimsPage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const data = await claimService.getClaims();
      setClaims(data);
    } catch (error) {
      console.error('Failed to load claims:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter claims
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      searchTerm === '' ||
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.carrierName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || claim.claimStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner text="Loading claims..." />;
  }

  return (
    <div className="time-entry-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <DxcHeading level={1} text="Claims" />

        {/* Stats Summary */}
        <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
          <div className="stat-card">
            <DxcFlex direction="column" gap="var(--spacing-gap-s)">
              <DxcTypography
                fontSize="32px"
                fontWeight="font-weight-semibold"
                color="var(--color-blue-600)"
              >
                {claims.length}
              </DxcTypography>
              <DxcTypography
                fontSize="font-scale-02"
                color="var(--color-fg-neutral-stronger)"
              >
                Total Claims
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
                {claims.filter((c) => c.claimStatus === 'OPEN').length}
              </DxcTypography>
              <DxcTypography
                fontSize="font-scale-02"
                color="var(--color-fg-neutral-stronger)"
              >
                Open Claims
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
                {formatCurrency(claims.reduce((sum, c) => sum + c.totalAmount, 0))}
              </DxcTypography>
              <DxcTypography
                fontSize="font-scale-02"
                color="var(--color-fg-neutral-stronger)"
              >
                Total Billed
              </DxcTypography>
            </DxcFlex>
          </div>
        </DxcFlex>

        {/* Filters */}
        <div className="time-entry-card">
          <DxcFlex gap="var(--spacing-gap-m)" alignItems="flex-end">
            <div style={{ flex: 1 }}>
              <DxcTextInput
                label="Search"
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                placeholder="Search by claim #, claimant, or carrier..."
              />
            </div>
            <DxcSelect
              label="Status"
              options={[
                { label: 'All Status', value: 'ALL' },
                { label: 'Open', value: 'OPEN' },
                { label: 'Pending', value: 'PENDING' },
                { label: 'Closed', value: 'CLOSED' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            />
          </DxcFlex>
        </div>

        {/* Claims Table */}
        <div className="time-entry-card">
          <DxcFlex direction="column" gap="var(--spacing-gap-l)">
            <DxcHeading level={3} text="Active Claims" />

            <DataTable
              columns={[
                {
                  key: 'claimNumber',
                  header: 'Claim #',
                  render: (row) => (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/claims/${row.claimNumber}`);
                      }}
                      style={{ color: 'var(--color-blue-600)', textDecoration: 'none' }}
                    >
                      {row.claimNumber}
                    </a>
                  ),
                },
                { key: 'claimantName', header: 'Claimant' },
                { key: 'carrierName', header: 'Carrier' },
                {
                  key: 'claimType',
                  header: 'Type',
                  render: (row) => row.claimType.replace('_', ' '),
                },
                {
                  key: 'totalHours',
                  header: 'Total Hours',
                  render: (row) => formatDuration(row.totalHours),
                },
                {
                  key: 'totalAmount',
                  header: 'Total Amount',
                  render: (row) => formatCurrency(row.totalAmount),
                },
                {
                  key: 'claimStatus',
                  header: 'Status',
                  render: (row) => <StatusBadge status={row.claimStatus} />,
                },
              ]}
              data={filteredClaims}
              emptyMessage="No claims found"
            />
          </DxcFlex>
        </div>
      </DxcFlex>
    </div>
  );
}
