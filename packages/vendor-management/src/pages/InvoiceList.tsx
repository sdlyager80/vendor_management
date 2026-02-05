import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DxcFlex, DxcSelect, DxcButton } from '@dxc-technology/halstack-react';
import { PageHeader, DataTable, StatusBadge } from '@shared/components';
import { formatDate, formatCurrency } from '@shared/utils';
import { invoiceService } from '../services/invoiceService';
import type { Invoice } from '@shared/types';

export default function InvoiceList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    loadInvoices();
  }, [statusFilter]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getInvoices({
        status: statusFilter || undefined,
      });
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (invoiceId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await invoiceService.approveInvoice(invoiceId);
      loadInvoices();
    } catch (error) {
      console.error('Failed to approve invoice:', error);
    }
  };

  const handleReject = async (invoiceId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await invoiceService.rejectInvoice(invoiceId, reason);
      loadInvoices();
    } catch (error) {
      console.error('Failed to reject invoice:', error);
    }
  };

  const totalPending = invoices
    .filter((i) => i.status === 'PENDING_REVIEW')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <DxcFlex direction="column" gap="1.5rem" style={{ padding: '2rem' }}>
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices • ${formatCurrency(totalPending)} pending`}
      />

      {/* Filters */}
      <DxcFlex gap="1rem" alignItems="flex-end">
        <div style={{ width: '200px' }}>
          <DxcSelect
            label="Status"
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Pending Review', value: 'PENDING_REVIEW' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' },
              { label: 'Paid', value: 'PAID' },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          />
        </div>
      </DxcFlex>

      {/* Invoices Table */}
      <DataTable
        columns={[
          { key: 'invoiceNumber', header: 'Invoice #', width: '140px' },
          { key: 'vendorName', header: 'Vendor' },
          { key: 'claimNumber', header: 'Claim #', width: '140px' },
          {
            key: 'invoiceDate',
            header: 'Invoice Date',
            render: (row) => formatDate(row.invoiceDate),
          },
          {
            key: 'dueDate',
            header: 'Due Date',
            render: (row) => formatDate(row.dueDate),
          },
          {
            key: 'totalAmount',
            header: 'Amount',
            render: (row) => formatCurrency(row.totalAmount),
          },
          {
            key: 'status',
            header: 'Status',
            width: '150px',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            width: '200px',
            render: (row) =>
              row.status === 'PENDING_REVIEW' ? (
                <DxcFlex gap="0.5rem">
                  <DxcButton
                    label="Approve"
                    mode="text"
                    onClick={(e) => handleApprove(row.id, e)}
                  />
                  <DxcButton
                    label="Reject"
                    mode="text"
                    onClick={(e) => handleReject(row.id, e)}
                  />
                </DxcFlex>
              ) : null,
          },
        ]}
        data={invoices}
        loading={loading}
        onRowClick={(invoice) => navigate(`/invoices/${invoice.id}`)}
        emptyMessage="No invoices found"
      />
    </DxcFlex>
  );
}
