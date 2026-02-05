import { useEffect, useState } from 'react';
import { DxcFlex, DxcCard, DxcHeading, DxcTabs } from '@dxc-technology/halstack-react';
import { PageHeader, DataTable } from '@shared/components';
import { formatCurrency } from '@shared/utils';
import { timeEntryService } from '../services/timeEntryService';
import { expenseService } from '../services/expenseService';
import type { ActivityCode, ExpenseType } from '@shared/types';

export default function Configuration() {
  const [activeTab, setActiveTab] = useState(0);
  const [activityCodes, setActivityCodes] = useState<ActivityCode[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfigData();
  }, []);

  const loadConfigData = async () => {
    try {
      setLoading(true);
      const [codes, types] = await Promise.all([
        timeEntryService.getActivityCodes(),
        expenseService.getExpenseTypes(),
      ]);
      setActivityCodes(codes);
      setExpenseTypes(types);
    } catch (error) {
      console.error('Failed to load configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <PageHeader
        title="Configuration"
        subtitle="Manage activity codes, expense types, and billing settings"
      />

      {/* Tabs */}
      <DxcTabs
        tabs={[
          { label: 'Activity Codes' },
          { label: 'Expense Types' },
          { label: 'Rate Schedules' },
          { label: 'Event Triggers' },
        ]}
        activeTabIndex={activeTab}
        onTabClick={setActiveTab}
      />

      {/* Activity Codes Tab */}
      {activeTab === 0 && (
        <div className="content-card">
          <DxcHeading level={3} text="Activity Codes" />

          <DataTable
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Name' },
              {
                key: 'category',
                header: 'Category',
                render: (row) => row.category.replace(/_/g, ' '),
              },
              {
                key: 'billingType',
                header: 'Billing Type',
                render: (row) => row.billingType.replace(/_/g, ' '),
              },
              {
                key: 'billable',
                header: 'Billable',
                render: (row) => (row.billable ? 'Yes' : 'No'),
              },
              {
                key: 'autoTriggerEnabled',
                header: 'Auto-Trigger',
                render: (row) => (row.autoTriggerEnabled ? '✓' : '-'),
              },
            ]}
            data={activityCodes}
            loading={loading}
            emptyMessage="No activity codes configured"
          />
        </div>
      )}

      {/*Expense Types Tab */}
      {activeTab === 1 && (
        <div className="content-card">
          <DxcHeading level={3} text="Expense Types" />

          <DataTable
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Name' },
              { key: 'category', header: 'Category' },
              {
                key: 'rateType',
                header: 'Rate Type',
                render: (row) => row.rateType.replace(/_/g, ' '),
              },
              {
                key: 'defaultRate',
                header: 'Default Rate',
                render: (row) => (row.defaultRate ? formatCurrency(row.defaultRate) : '-'),
              },
              {
                key: 'rateCap',
                header: 'Rate Cap',
                render: (row) => (row.rateCap ? formatCurrency(row.rateCap) : '-'),
              },
              {
                key: 'receiptRequired',
                header: 'Receipt Required',
                render: (row) => (row.receiptRequired ? 'Yes' : 'No'),
              },
            ]}
            data={expenseTypes}
            loading={loading}
            emptyMessage="No expense types configured"
          />
        </div>
      )}

      {/*Rate Schedules Tab */}
      {activeTab === 2 && (
        <div className="content-card">
          <DxcHeading level={3} text="Rate Schedules" />
          <p style={{ marginTop: 'var(--spacing-gap-m)' }}>
            Rate schedule management for role levels and carrier-specific overrides coming soon.
          </p>
        </div>
      )}

      {/*Event Triggers Tab */}
      {activeTab === 3 && (
        <div className="content-card">
          <DxcHeading level={3} text="Event Triggers" />
          <p style={{ marginTop: 'var(--spacing-gap-m)' }}>
            Configure automatic time capture from Assure Claims events coming soon.
          </p>
        </div>
      )}
      </DxcFlex>
    </div>
  );
}
