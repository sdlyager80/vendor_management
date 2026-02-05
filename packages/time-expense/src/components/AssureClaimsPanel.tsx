import { DxcFlex, DxcTypography, DxcHeading } from '@dxc-technology/halstack-react';
import { formatCurrency, formatDateTime } from '@shared/utils';
import type { AssureClaimsEvent } from '@shared/types';

interface AssureClaimsPanelProps {
  claimNumber: string;
  events: AssureClaimsEvent[];
}

export function AssureClaimsPanel({ claimNumber, events }: AssureClaimsPanelProps) {
  const autoBilledEvents = events.filter((e) => e.status === 'AUTO_BILLED');
  const pendingReviewEvents = events.filter((e) => e.status === 'PENDING_REVIEW');
  const totalAutoBilled = autoBilledEvents.reduce((sum, e) => sum + (e.autoBillAmount || 0), 0);

  const getEventIcon = (eventType: string) => {
    const icons: Record<string, string> = {
      DOCUMENT_UPLOAD: '📄',
      STATUS_CHANGE: '🔄',
      EMAIL_SENT: '📧',
      PHONE_LOG: '📞',
      NOTE_ADDED: '📝',
      ESTIMATE_UPDATED: '💰',
    };
    return icons[eventType] || '📋';
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        borderRadius: '12px',
        padding: '24px',
        color: '#FFFFFF',
      }}
    >
      <DxcFlex direction="column" gap="var(--spacing-gap-l)">
        {/* Header */}
        <DxcFlex justifyContent="space-between" alignItems="center">
          <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
            <span className="material-icons" style={{ fontSize: '24px' }}>
              sync
            </span>
            <DxcHeading level={3} text="Assure Claims Integration" style={{ color: '#FFFFFF' }} />
          </DxcFlex>
          <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                animation: 'pulse 2s infinite',
              }}
            />
            <DxcTypography fontSize="font-scale-01" color="rgba(255, 255, 255, 0.9)">
              Live
            </DxcTypography>
          </DxcFlex>
        </DxcFlex>

        {/* Metrics */}
        <DxcFlex gap="var(--spacing-gap-l)" wrap="wrap">
          <div>
            <DxcTypography fontSize="font-scale-01" color="rgba(255, 255, 255, 0.7)">
              Events
            </DxcTypography>
            <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-semibold" color="#FFFFFF">
              {events.length}
            </DxcTypography>
          </div>

          <div>
            <DxcTypography fontSize="font-scale-01" color="rgba(255, 255, 255, 0.7)">
              Auto-Billed
            </DxcTypography>
            <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-semibold" color="#FFFFFF">
              {formatCurrency(totalAutoBilled)}
            </DxcTypography>
          </div>

          <div>
            <DxcTypography fontSize="font-scale-01" color="rgba(255, 255, 255, 0.7)">
              Pending Review
            </DxcTypography>
            <DxcTypography fontSize="font-scale-04" fontWeight="font-weight-semibold" color="#FFFFFF">
              {pendingReviewEvents.length}
            </DxcTypography>
          </div>
        </DxcFlex>

        {/* Event Feed */}
        <div>
          <DxcTypography
            fontSize="font-scale-02"
            fontWeight="font-weight-semibold"
            color="rgba(255, 255, 255, 0.9)"
            style={{ marginBottom: '12px' }}
          >
            Recent Events
          </DxcTypography>

          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  borderLeft: `4px solid ${
                    event.status === 'AUTO_BILLED' ? '#4caf50' : '#ff9800'
                  }`,
                }}
              >
                <DxcFlex justifyContent="space-between" alignItems="flex-start" gap="var(--spacing-gap-m)">
                  <DxcFlex gap="var(--spacing-gap-s)" style={{ flex: 1 }}>
                    <span style={{ fontSize: '20px' }}>{getEventIcon(event.eventType)}</span>
                    <div style={{ flex: 1 }}>
                      <DxcTypography
                        fontSize="font-scale-02"
                        fontWeight="font-weight-semibold"
                        color="#FFFFFF"
                      >
                        {event.eventTitle}
                      </DxcTypography>
                      <DxcTypography fontSize="font-scale-01" color="rgba(255, 255, 255, 0.8)">
                        {event.eventDescription}
                      </DxcTypography>
                      <DxcTypography fontSize="font-scale-01" color="rgba(255, 255, 255, 0.6)">
                        {formatDateTime(event.timestamp)}
                      </DxcTypography>
                    </div>
                  </DxcFlex>

                  {event.autoBillAmount && (
                    <DxcFlex direction="column" alignItems="flex-end">
                      <DxcTypography
                        fontSize="font-scale-02"
                        fontWeight="font-weight-semibold"
                        color="#FFFFFF"
                      >
                        {formatCurrency(event.autoBillAmount)}
                      </DxcTypography>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor:
                            event.status === 'AUTO_BILLED'
                              ? 'rgba(76, 175, 80, 0.3)'
                              : 'rgba(255, 152, 0, 0.3)',
                          color: '#FFFFFF',
                        }}
                      >
                        {event.status === 'AUTO_BILLED' ? '✓ Billed' : '⚠ Review'}
                      </span>
                    </DxcFlex>
                  )}
                </DxcFlex>
              </div>
            ))}
          </div>
        </div>
      </DxcFlex>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
