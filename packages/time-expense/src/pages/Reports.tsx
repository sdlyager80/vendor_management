import { useEffect, useState } from 'react';
import { DxcFlex, DxcCard, DxcHeading, DxcParagraph, DxcButton } from '@dxc-technology/halstack-react';
import { PageHeader, StatCard } from '@shared/components';
import { formatCurrency } from '@shared/utils';
import { timeEntryService } from '../services/timeEntryService';

export default function Reports() {
  const [stats, setStats] = useState({
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    pendingEntries: 0,
    autoCaptured: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await timeEntryService.getTimeEntryStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Mock calculations
  const avgRate = 125;
  const weeklyRevenue = stats.weekHours * avgRate;
  const monthlyRevenue = stats.monthHours * avgRate;
  const autoCapturePercent = stats.autoCaptured > 0
    ? ((stats.autoCaptured / (stats.pendingEntries + stats.autoCaptured)) * 100).toFixed(1)
    : 0;

  return (
    <DxcFlex direction="column" gap="2rem" style={{ padding: '2rem' }}>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Time and expense performance metrics"
        actions={[
          {
            label: 'Export Report',
            onClick: () => alert('Export functionality coming soon'),
            mode: 'secondary',
          },
        ]}
      />

      {/* Summary Stats */}
      <DxcFlex gap="1.5rem" wrap="wrap">
        <StatCard
          title="Weekly Hours"
          value={stats.weekHours.toFixed(1)}
          subtitle={formatCurrency(weeklyRevenue)}
        />

        <StatCard
          title="Monthly Hours"
          value={stats.monthHours.toFixed(1)}
          subtitle={formatCurrency(monthlyRevenue)}
        />

        <StatCard
          title="Avg Hourly Rate"
          value={formatCurrency(avgRate)}
          subtitle="Across all activities"
        />

        <StatCard
          title="Auto-Capture Rate"
          value={`${autoCapturePercent}%`}
          subtitle={`${stats.autoCaptured} of ${stats.pendingEntries + stats.autoCaptured} entries`}
        />
      </DxcFlex>

      {/* Detailed Reports */}
      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcHeading level={3} text="Time Tracking Summary" />

        <DxcFlex direction="column" gap="1.5rem" style={{ marginTop: '1rem' }}>
          <div>
            <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
              Today's Activity
            </DxcParagraph>
            <DxcParagraph style={{ margin: 0 }}>
              {stats.todayHours.toFixed(1)} hours logged • {formatCurrency(stats.todayHours * avgRate)} billed
            </DxcParagraph>
          </div>

          <div>
            <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
              This Week
            </DxcParagraph>
            <DxcParagraph style={{ margin: 0 }}>
              {stats.weekHours.toFixed(1)} hours • {formatCurrency(weeklyRevenue)} revenue
            </DxcParagraph>
          </div>

          <div>
            <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
              This Month
            </DxcParagraph>
            <DxcParagraph style={{ margin: 0 }}>
              {stats.monthHours.toFixed(1)} hours • {formatCurrency(monthlyRevenue)} revenue
            </DxcParagraph>
          </div>

          <div>
            <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
              Pending Submission
            </DxcParagraph>
            <DxcParagraph style={{ margin: 0 }}>
              {stats.pendingEntries} entries awaiting billing submission
            </DxcParagraph>
          </div>
        </DxcFlex>
      </DxcCard>

      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcHeading level={3} text="Activity Breakdown" />
        <DxcParagraph style={{ marginTop: '1rem' }}>
          Detailed activity breakdowns, trend analysis, and comparative reports will be available here.
        </DxcParagraph>
      </DxcCard>
    </DxcFlex>
  );
}
