import { DxcCard, DxcHeading, DxcParagraph, DxcFlex, DxcTypography } from '@dxc-technology/halstack-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export function StatCard({ title, value, subtitle, trend, onClick, variant = 'default' }: StatCardProps) {
  const getCardClass = () => {
    switch (variant) {
      case 'primary':
        return 'stat-card-primary';
      case 'success':
        return 'stat-card-success';
      case 'warning':
        return 'stat-card-warning';
      case 'error':
        return 'stat-card-error';
      default:
        return 'stat-card';
    }
  };

  const isColorVariant = variant !== 'default';
  const textColor = isColorVariant ? '#FFFFFF' : undefined;

  return (
    <div
      className={getCardClass()}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <DxcFlex direction="column" gap="var(--spacing-gap-s)">
        {isColorVariant ? (
          <>
            <DxcTypography
              fontSize="font-scale-01"
              color={textColor}
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {title}
            </DxcTypography>
            <DxcTypography
              fontSize="32px"
              fontWeight="font-weight-semibold"
              color={textColor}
            >
              {value}
            </DxcTypography>
            {subtitle && (
              <DxcTypography fontSize="font-scale-01" color={textColor}>
                {subtitle}
              </DxcTypography>
            )}
          </>
        ) : (
          <>
            <DxcTypography
              fontSize="32px"
              fontWeight="font-weight-semibold"
              color="var(--color-blue-600)"
            >
              {value}
            </DxcTypography>
            <DxcTypography
              fontSize="font-scale-02"
              color="var(--color-fg-neutral-stronger)"
            >
              {title}
            </DxcTypography>
            {subtitle && (
              <DxcTypography fontSize="font-scale-02" color="var(--color-fg-neutral-dark)">
                {subtitle}
              </DxcTypography>
            )}
          </>
        )}

        {trend && (
          <DxcTypography fontSize="font-scale-02" color={textColor || 'var(--color-fg-neutral-dark)'}>
            <span style={{
              color: trend.isPositive
                ? (isColorVariant ? '#FFFFFF' : 'var(--color-green-600)')
                : (isColorVariant ? '#FFFFFF' : 'var(--color-red-600)')
            }}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            {' vs last period'}
          </DxcTypography>
        )}
      </DxcFlex>
    </div>
  );
}
