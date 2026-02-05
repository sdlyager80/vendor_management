import { useEffect, useState } from 'react';
import { DxcFlex, DxcCard, DxcHeading, DxcTabs, DxcParagraph } from '@dxc-technology/halstack-react';
import { PageHeader, DataTable, StatusBadge } from '@shared/components';
import { formatDate, formatCurrency } from '@shared/utils';
import { referralService } from '../services/referralService';
import { invoiceService } from '../services/invoiceService';
import type { Referral, Invoice } from '@shared/types';

export default function VendorPortal() {
  const [activeTab, setActiveTab] = useState(0);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortalData();
  }, []);

  const loadPortalData = async () => {
    try {
      setLoading(true);
      // Filter by current vendor - in production, this would use vendor auth
      const [referralData, invoiceData] = await Promise.all([
        referralService.getReferrals({ vendorId: 'VEN-001' }),
        invoiceService.getInvoices({ vendorId: 'VEN-001' }),
      ]);
      setReferrals(referralData);
      setInvoices(invoiceData);
    } catch (error) {
      console.error('Failed to load portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DxcFlex direction="column" gap="1.5rem" style={{ padding: '2rem' }}>
      <PageHeader
        title="Vendor Portal"
        subtitle="Medical Examination Services Inc"
      />

      {/* Summary Cards */}
      <DxcFlex gap="1.5rem" wrap="wrap">
        <DxcCard style={{ minWidth: '250px', padding: '1.5rem' }}>
          <DxcHeading level={4} text="Active Referrals" />
          <DxcParagraph style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
            <strong>{referrals.filter((r) => r.status === 'IN_PROGRESS').length}</strong>
          </DxcParagraph>
          <DxcParagraph style={{ margin: 0 }}>In progress</DxcParagraph>
        </DxcCard>

        <DxcCard style={{ minWidth: '250px', padding: '1.5rem' }}>
          <DxcHeading level={4} text="Pending Invoices" />
          <DxcParagraph style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
            <strong>{invoices.filter((i) => i.status === 'PENDING_REVIEW').length}</strong>
          </DxcParagraph>
          <DxcParagraph style={{ margin: 0 }}>Awaiting approval</DxcParagraph>
        </DxcCard>

        <DxcCard style={{ minWidth: '250px', padding: '1.5rem' }}>
          <DxcHeading level={4} text="Outstanding Payment" />
          <DxcParagraph style={{ fontSize: '2rem', margin: '0.5rem 0' }}>
            <strong>
              {formatCurrency(
                invoices
                  .filter((i) => i.status === 'APPROVED')
                  .reduce((sum, i) => sum + i.totalAmount, 0)
              )}
            </strong>
          </DxcParagraph>
          <DxcParagraph style={{ margin: 0 }}>Approved, pending payment</DxcParagraph>
        </DxcCard>
      </DxcFlex>

      {/* Tabs */}
      <DxcTabs
        tabs={[{ label: 'My Referrals' }, { label: 'Invoices & Billing' }]}
        activeTabIndex={activeTab}
        onTabClick={setActiveTab}
      />

      {/* Referrals Tab */}
      {activeTab === 0 && (
        <DxcCard style={{ padding: '1.5rem' }}>
          <DxcHeading level={3} text="My Referrals" />

          <DataTable
            columns={[
              { key: 'referralNumber', header: 'Referral #' },
              { key: 'claimNumber', header: 'Claim #' },
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
                render: (row) => <StatusBadge status={row.status} />,
              },
            ]}
            data={referrals}
            loading={loading}
            emptyMessage="No referrals assigned"
          />
        </DxcCard>
      )}

      {/* Invoices Tab */}
      {activeTab === 1 && (
        <DxcCard style={{ padding: '1.5rem' }}>
          <DxcHeading level={3} text="Invoices & Billing" />

          <DataTable
            columns={[
              { key: 'invoiceNumber', header: 'Invoice #' },
              { key: 'claimNumber', header: 'Claim #' },
              {
                key: 'invoiceDate',
                header: 'Date',
                render: (row) => formatDate(row.invoiceDate),
              },
              {
                key: 'totalAmount',
                header: 'Amount',
                render: (row) => formatCurrency(row.totalAmount),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: 'paymentDate',
                header: 'Paid',
                render: (row) => (row.paymentDate ? formatDate(row.paymentDate) : '-'),
              },
            ]}
            data={invoices}
            loading={loading}
            emptyMessage="No invoices submitted"
          />
        </DxcCard>
      )}
    </DxcFlex>
  );
}
