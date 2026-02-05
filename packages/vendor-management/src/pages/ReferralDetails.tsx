import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DxcFlex,
  DxcCard,
  DxcHeading,
  DxcParagraph,
  DxcButton,
  DxcSelect,
} from '@dxc-technology/halstack-react';
import { PageHeader, StatusBadge, LoadingSpinner } from '@shared/components';
import { formatDate, formatCurrency } from '@shared/utils';
import { referralService } from '../services/referralService';
import type { Referral } from '@shared/types';

export default function ReferralDetails() {
  const { referralId } = useParams<{ referralId: string }>();
  const navigate = useNavigate();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (referralId) {
      loadReferral();
    }
  }, [referralId]);

  const loadReferral = async () => {
    if (!referralId) return;
    try {
      setLoading(true);
      const data = await referralService.getReferral(referralId);
      setReferral(data);
    } catch (error) {
      console.error('Failed to load referral:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!referralId) return;
    try {
      setUpdatingStatus(true);
      await referralService.updateReferralStatus(referralId, newStatus);
      loadReferral();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading referral..." />;
  }

  if (!referral) {
    return (
      <DxcFlex direction="column" gap="1rem" style={{ padding: '2rem' }}>
        <DxcHeading level={1} text="Referral not found" />
        <DxcButton label="Back to Referrals" onClick={() => navigate('/referrals')} />
      </DxcFlex>
    );
  }

  return (
    <DxcFlex direction="column" gap="1.5rem" style={{ padding: '2rem' }}>
      <PageHeader
        title={`Referral ${referral.referralNumber}`}
        subtitle={`Claim ${referral.claimNumber} • ${referral.claimantName}`}
        actions={[
          {
            label: 'View Claim',
            onClick: () => alert('Navigate to Assure Claims'),
            mode: 'secondary',
          },
        ]}
      />

      {/* Status Card */}
      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcFlex gap="2rem" alignItems="center" wrap="wrap">
          <div>
            <DxcParagraph style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
              Status
            </DxcParagraph>
            <StatusBadge status={referral.status} />
          </div>

          <div>
            <DxcParagraph style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
              Update Status
            </DxcParagraph>
            <DxcSelect
              options={[
                { label: 'Assigned', value: 'ASSIGNED' },
                { label: 'Accepted', value: 'ACCEPTED' },
                { label: 'In Progress', value: 'IN_PROGRESS' },
                { label: 'Complete', value: 'COMPLETE' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
              value={referral.status}
              onChange={handleStatusChange}
              disabled={updatingStatus}
            />
          </div>

          <div>
            <DxcParagraph style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
              SLA Status
            </DxcParagraph>
            {referral.slaBreach ? (
              <span style={{ color: '#D0011B', fontWeight: 600 }}>⚠ Breach</span>
            ) : (
              <span style={{ color: '#0095FF' }}>✓ On Track</span>
            )}
          </div>
        </DxcFlex>
      </DxcCard>

      {/* Referral Details */}
      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcHeading level={3} text="Referral Information" />

        <DxcFlex direction="column" gap="1.5rem" style={{ marginTop: '1rem' }}>
          <DxcFlex gap="2rem" wrap="wrap">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Vendor</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>{referral.vendorName}</DxcParagraph>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Service Type</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>{referral.serviceType}</DxcParagraph>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>
                Service Category
              </DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>{referral.serviceCategory}</DxcParagraph>
            </div>
          </DxcFlex>

          <DxcFlex gap="2rem" wrap="wrap">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Assigned Date</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {formatDate(referral.assignedDate)}
              </DxcParagraph>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Due Date</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {referral.dueDate ? formatDate(referral.dueDate) : 'Not set'}
              </DxcParagraph>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Estimated Cost</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {referral.estimatedCost ? formatCurrency(referral.estimatedCost) : 'Not set'}
              </DxcParagraph>
            </div>
          </DxcFlex>

          <div>
            <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Instructions</DxcParagraph>
            <DxcParagraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {referral.instructions}
            </DxcParagraph>
          </div>

          <div>
            <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Handler</DxcParagraph>
            <DxcParagraph style={{ margin: 0 }}>{referral.handlerName}</DxcParagraph>
          </div>
        </DxcFlex>
      </DxcCard>

      {/* Claim Context */}
      <DxcCard style={{ padding: '1.5rem' }}>
        <DxcHeading level={3} text="Claim Information" />

        <DxcFlex direction="column" gap="1rem" style={{ marginTop: '1rem' }}>
          <DxcFlex gap="2rem" wrap="wrap">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Claim Number</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>{referral.claimNumber}</DxcParagraph>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Claimant</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>{referral.claimantName}</DxcParagraph>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Date of Loss</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {formatDate(referral.dateOfLoss)}
              </DxcParagraph>
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <DxcParagraph style={{ margin: 0, fontWeight: 600 }}>Claim Type</DxcParagraph>
              <DxcParagraph style={{ margin: 0 }}>
                {referral.claimType.replace(/_/g, ' ')}
              </DxcParagraph>
            </div>
          </DxcFlex>
        </DxcFlex>
      </DxcCard>
    </DxcFlex>
  );
}
