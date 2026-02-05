import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DxcFlex,
  DxcCard,
  DxcHeading,
  DxcParagraph,
  DxcTabs,
  DxcButton,
} from '@dxc-technology/halstack-react';
import { PageHeader, StatusBadge, LoadingSpinner } from '@shared/components';
import { formatPhoneNumber } from '@shared/utils';
import { vendorService } from '../services/vendorService';
import type { Vendor } from '@shared/types';

export default function VendorDetails() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (vendorId) {
      loadVendor();
    }
  }, [vendorId]);

  const loadVendor = async () => {
    if (!vendorId) return;
    try {
      setLoading(true);
      const data = await vendorService.getVendor(vendorId);
      setVendor(data);
    } catch (error) {
      console.error('Failed to load vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading vendor details..." />;
  }

  if (!vendor) {
    return (
      <div className="page-container">
        <DxcFlex direction="column" gap="var(--spacing-gap-m)">
          <DxcHeading level={1} text="Vendor not found" />
          <DxcButton label="Back to Vendors" onClick={() => navigate('/vendors')} />
        </DxcFlex>
      </div>
    );
  }

  const primaryContact = vendor.contacts.find((c) => c.isPrimary);

  return (
    <div className="page-container">
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        <PageHeader
          title={vendor.legalName}
          subtitle={`${vendor.id} • ${vendor.vendorType.replace(/_/g, ' ')}`}
          actions={[
            {
              label: 'Create Referral',
              onClick: () =>
                navigate('/referrals/new', { state: { vendorId: vendor.id } }),
              mode: 'primary',
            },
            {
              label: 'Edit',
              onClick: () => navigate(`/vendors/${vendor.id}/edit`),
              mode: 'secondary',
            },
          ]}
        />

        {/* Status Card */}
        <div className="content-card">
          <DxcFlex gap="var(--spacing-gap-xl)" alignItems="center">
            <div>
              <DxcParagraph style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
                Status
              </DxcParagraph>
              <StatusBadge status={vendor.status} />
            </div>
            <div>
              <DxcParagraph style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
                Service Territory
              </DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {vendor.serviceTerritory.join(', ')}
              </DxcParagraph>
            </div>
            <div>
              <DxcParagraph style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
                TIN
              </DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {vendor.tin.replace(/(\d{2})(\d{7})/, '$1-$2')}
              </DxcParagraph>
            </div>
          </DxcFlex>
        </div>

      {/* Tabs */}
      <DxcTabs
        tabs={[
          {
            label: 'Overview',
          },
          {
            label: 'Contacts',
          },
          {
            label: 'Documents',
          },
          {
            label: 'Performance',
          },
        ]}
        activeTabIndex={activeTab}
        onTabClick={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === 0 && (
        <div className="content-card">
          <DxcHeading level={3} text="Corporate Information" />

          <DxcFlex direction="column" gap="var(--spacing-gap-m)" style={{ marginTop: '1rem' }}>
            <div>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
                Corporate Address
              </DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {vendor.corporateAddress.street1}
                {vendor.corporateAddress.street2 && `, ${vendor.corporateAddress.street2}`}
              </DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {vendor.corporateAddress.city}, {vendor.corporateAddress.state}{' '}
                {vendor.corporateAddress.postalCode}
              </DxcParagraph>
            </div>

            <div>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
                Payment Terms
              </DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {vendor.paymentConfig.method} • {vendor.paymentConfig.terms.replace(/_/g, ' ')}
              </DxcParagraph>
            </div>
          </DxcFlex>
        </div>
      )}

      {activeTab === 1 && (
        <div className="content-card">
          <DxcHeading level={3} text="Contacts" />

          <DxcFlex direction="column" gap="var(--spacing-gap-l)" style={{ marginTop: '1rem' }}>
            {vendor.contacts.map((contact) => (
              <div key={contact.id}>
                <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
                  {contact.name} {contact.isPrimary && '(Primary)'}
                </DxcParagraph>
                <DxcParagraph style={{ margin: 0 }}>
                  {contact.role.replace(/_/g, ' ')}
                </DxcParagraph>
                <DxcParagraph style={{ margin: 0 }}>
                  {contact.email} • {formatPhoneNumber(contact.phone)}
                </DxcParagraph>
              </div>
            ))}
          </DxcFlex>
        </div>
      )}

      {activeTab === 2 && (
        <div className="content-card">
          <DxcHeading level={3} text="Documents" />
          <DxcParagraph>Document management coming soon</DxcParagraph>
        </div>
      )}

      {activeTab === 3 && (
        <div className="content-card">
          <DxcHeading level={3} text="Performance Metrics" />
          <DxcParagraph>Performance tracking coming soon</DxcParagraph>
        </div>
      )}
      </DxcFlex>
    </div>
  );
}
