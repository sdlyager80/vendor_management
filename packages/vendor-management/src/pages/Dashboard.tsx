import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DxcFlex, DxcHeading, DxcButton, DxcCard } from '@dxc-technology/halstack-react';
import { StatCard, LoadingSpinner, PageHeader, DataTable } from '@shared/components';
import { formatDate, formatCurrency } from '@shared/utils';
import { vendorService } from '../services/vendorService';
import { referralService } from '../services/referralService';
import { invoiceService } from '../services/invoiceService';
import type { Referral } from '@shared/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vendors: { totalActive: 0, totalInactive: 0, pendingOnboarding: 0 },
    referrals: { totalOpen: 0, slaBreaches: 0 },
    invoices: { totalPending: 0, totalAmount: 0 },
  });
  const [recentReferrals, setRecentReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [vendorStats, referralStats, invoiceStats, referrals] = await Promise.all([
        vendorService.getVendorStats(),
        referralService.getReferralStats(),
        invoiceService.getInvoiceStats(),
        referralService.getReferrals(),
      ]);

      setStats({
        vendors: vendorStats,
        referrals: referralStats,
        invoices: invoiceStats,
      });

      setRecentReferrals(referrals.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <DxcFlex direction="column" gap="2rem" style={{ padding: '2rem' }}>
      <PageHeader
        title="Vendor Management Dashboard"
        subtitle="Monitor vendor operations, referrals, and billing"
        actions={[
          {
            label: 'Create Referral',
            onClick: () => navigate('/referrals/new'),
            mode: 'primary',
          },
          {
            label: 'Onboard Vendor',
            onClick: () => navigate('/vendors/onboard/new'),
            mode: 'secondary',
          },
        ]}
      />

      {/* KPI Cards */}
      <DxcFlex gap="1.5rem" wrap="wrap">
        <StatCard
          title="Active Vendors"
          value={stats.vendors.totalActive}
          subtitle="Currently operational"
          onClick={() => navigate('/vendors?status=ACTIVE')}
        />

        <StatCard
          title="Open Referrals"
          value={stats.referrals.totalOpen}
          subtitle="In progress"
          onClick={() => navigate('/referrals?status=IN_PROGRESS')}
        />

        <StatCard
          title="Pending Invoices"
          value={stats.invoices.totalPending}
          subtitle={formatCurrency(stats.invoices.totalAmount)}
          onClick={() => navigate('/invoices?status=PENDING_REVIEW')}
        />

        <StatCard
          title="SLA Breaches"
          value={stats.referrals.slaBreaches}
          subtitle="Require attention"
          onClick={() => navigate('/referrals?sla=breach')}
        />
      </DxcFlex>

      {/* Recent Referrals */}
      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: '1rem' }}>
          <DxcHeading level={3} text="Recent Referrals" />
          <DxcButton
            label="View All"
            mode="text"
            onClick={() => navigate('/referrals')}
          />
        </DxcFlex>

        <DataTable
          columns={[
            { key: 'referralNumber', header: 'Referral #' },
            { key: 'claimNumber', header: 'Claim #' },
            { key: 'vendorName', header: 'Vendor' },
            { key: 'serviceType', header: 'Service Type' },
            {
              key: 'assignedDate',
              header: 'Assigned',
              render: (row) => formatDate(row.assignedDate),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <span style={{ textTransform: 'capitalize' }}>
                  {row.status.replace(/_/g, ' ').toLowerCase()}
                </span>
              ),
            },
          ]}
          data={recentReferrals}
          onRowClick={(referral) => navigate(`/referrals/${referral.id}`)}
          emptyMessage="No recent referrals"
        />
      </DxcCard>
    </DxcFlex>
  );
}
