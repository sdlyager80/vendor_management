import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DxcFlex, DxcTextInput, DxcSelect } from '@dxc-technology/halstack-react';
import { PageHeader, DataTable, StatusBadge } from '@shared/components';
import { vendorService } from '../services/vendorService';
import type { Vendor } from '@shared/types';

export default function VendorList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    loadVendors();
  }, [statusFilter]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getVendors({
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });
      setVendors(data);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadVendors();
  };

  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <PageHeader
          title="Vendor Directory"
          subtitle={`${vendors.length} vendors`}
          actions={[
            {
              label: 'Onboard New Vendor',
              onClick: () => navigate('/vendors/onboard/new'),
              mode: 'primary',
            },
          ]}
        />

        {/* Filters */}
        <DxcFlex gap="var(--spacing-gap-m)" alignItems="flex-end">
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <DxcTextInput
              label="Search vendors"
              value={searchTerm}
              onChange={setSearchTerm}
              onBlur={handleSearch}
              placeholder="Search by name..."
            />
          </div>
          <div style={{ width: '200px' }}>
            <DxcSelect
              label="Status"
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
                { label: 'Pending', value: 'PENDING_DOCUMENTATION' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
            />
          </div>
        </DxcFlex>

        {/* Vendor Table */}
        <DataTable
          columns={[
            { key: 'id', header: 'ID', width: '100px' },
            { key: 'legalName', header: 'Vendor Name' },
            {
              key: 'vendorType',
              header: 'Type',
              render: (row) => row.vendorType.replace(/_/g, ' '),
            },
            {
              key: 'serviceTerritory',
              header: 'Service Area',
              render: (row) => row.serviceTerritory.join(', '),
            },
            {
              key: 'status',
              header: 'Status',
              width: '150px',
              render: (row) => <StatusBadge status={row.status} />,
            },
          ]}
          data={vendors}
          loading={loading}
          onRowClick={(vendor) => navigate(`/vendors/${vendor.id}`)}
          emptyMessage="No vendors found"
        />
      </DxcFlex>
    </div>
  );
}
