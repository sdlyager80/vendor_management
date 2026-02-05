import { DxcHeading, DxcFlex, DxcButton, DxcTypography } from '@dxc-technology/halstack-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    onClick: () => void;
    mode?: 'primary' | 'secondary' | 'text';
  }[];
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <DxcFlex
      justifyContent="space-between"
      alignItems="flex-start"
      style={{ marginBottom: 'var(--spacing-gap-l)' }}
    >
      <div>
        <DxcHeading level={1} text={title} />
        {subtitle && (
          <DxcTypography
            fontSize="font-scale-03"
            color="var(--color-fg-neutral-stronger)"
            style={{ marginTop: 'var(--spacing-gap-xs)' }}
          >
            {subtitle}
          </DxcTypography>
        )}
      </div>

      {actions && actions.length > 0 && (
        <DxcFlex gap="var(--spacing-gap-m)">
          {actions.map((action, index) => (
            <DxcButton
              key={index}
              label={action.label}
              mode={action.mode || 'primary'}
              onClick={action.onClick}
            />
          ))}
        </DxcFlex>
      )}
    </DxcFlex>
  );
}
