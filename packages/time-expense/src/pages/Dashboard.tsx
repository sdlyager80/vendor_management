import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DxcFlex, DxcHeading, DxcButton, DxcCard } from '@dxc-technology/halstack-react';
import { StatCard, LoadingSpinner, PageHeader, DataTable } from '@shared/components';
import { formatDuration, formatDate, formatCurrency } from '@shared/utils';
import { timeEntryService } from '../services/timeEntryService';
import { expenseService } from '../services/expenseService';
import type { TimeEntry } from '@shared/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    pendingEntries: 0,
    autoCaptured: 0,
  });
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [timeStats, entries] = await Promise.all([
        timeEntryService.getTimeEntryStats(),
        timeEntryService.getTimeEntries({ status: 'PENDING' }),
      ]);

      setStats(timeStats);
      setRecentEntries(entries.slice(0, 5));
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
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-xl)">
        <PageHeader
        title="Time & Expense Dashboard"
        subtitle="Track your time and expenses across all claims"
        actions={[
          {
            label: 'Log Time',
            onClick: () => navigate('/time'),
            mode: 'primary',
          },
          {
            label: 'Log Expense',
            onClick: () => navigate('/expense'),
            mode: 'secondary',
          },
        ]}
      />

      {/* KPI Cards */}
      <DxcFlex gap="var(--spacing-gap-l)" wrap="wrap">
        <StatCard
          title="Today's Hours"
          value={stats.todayHours.toFixed(1)}
          subtitle="Hours logged today"
        />

        <StatCard
          title="This Week"
          value={stats.weekHours.toFixed(1)}
          subtitle="Total hours"
        />

        <StatCard
          title="Pending Entries"
          value={stats.pendingEntries}
          subtitle="Awaiting submission"
          onClick={() => navigate('/time?status=DRAFT')}
        />

        <StatCard
          title="Auto-Captured"
          value={stats.autoCaptured}
          subtitle="Events captured"
          onClick={() => navigate('/time?captureType=AUTO')}
        />
      </DxcFlex>

      {/* Recent Time Entries */}
      <div className="content-card">
        <DxcFlex
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: 'var(--spacing-gap-m)' }}
        >
          <DxcHeading level={3} text="Pending Time Entries" />
          <DxcButton
            label="View All"
            mode="text"
            onClick={() => navigate('/time')}
          />
        </DxcFlex>

        <DataTable
          columns={[
            { key: 'entryDate', header: 'Date', render: (row) => formatDate(row.entryDate) },
            { key: 'claimNumber', header: 'Claim #' },
            { key: 'activityDescription', header: 'Activity' },
            {
              key: 'duration',
              header: 'Duration',
              render: (row) => formatDuration(row.duration),
            },
            {
              key: 'amount',
              header: 'Amount',
              render: (row) => formatCurrency(row.amount),
            },
            {
              key: 'captureType',
              header: 'Type',
              render: (row) => (
                <span style={{ textTransform: 'capitalize' }}>
                  {row.captureType.toLowerCase()}
                </span>
              ),
            },
          ]}
          data={recentEntries}
          onRowClick={(entry) => navigate(`/time?entryId=${entry.id}`)}
          emptyMessage="No pending entries"
        />
      </div>
      </DxcFlex>
    </div>
  );
}
