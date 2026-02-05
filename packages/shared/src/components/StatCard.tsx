import { DxcCard, DxcHeading, DxcParagraph, DxcFlex } from '@dxc-technology/halstack-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export function StatCard({ title, value, subtitle, trend, onClick }: StatCardProps) {
  return (
    <DxcCard
      style={{
        minWidth: '280px',
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <DxcFlex direction="column" gap="0.5rem">
        <DxcHeading level={4} text={title} />

        <DxcParagraph style={{ margin: 0 }}>
          <strong style={{ fontSize: '2.5rem', lineHeight: 1 }}>
            {value}
          </strong>
        </DxcParagraph>

        {subtitle && (
          <DxcParagraph style={{ margin: 0, color: '#666' }}>
            {subtitle}
          </DxcParagraph>
        )}

        {trend && (
          <DxcParagraph style={{ margin: 0 }}>
            <span style={{ color: trend.isPositive ? '#0095FF' : '#D0011B' }}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            {' vs last period'}
          </DxcParagraph>
        )}
      </DxcFlex>
    </DxcCard>
  );
}
