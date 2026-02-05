import { DxcFlex, DxcHeading, DxcTypography, DxcButton } from '@dxc-technology/halstack-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <DxcFlex
      direction="column"
      gap="var(--spacing-gap-l)"
      alignItems="center"
      justifyContent="center"
      style={{ padding: 'var(--spacing-padding-xl) var(--spacing-padding-l)', textAlign: 'center' }}
    >
      {icon && <div style={{ fontSize: '3rem', opacity: 0.3 }}>{icon}</div>}

      <DxcHeading level={3} text={title} />

      {description && (
        <DxcTypography
          fontSize="font-scale-03"
          color="var(--color-fg-neutral-stronger)"
          style={{ maxWidth: '500px' }}
        >
          {description}
        </DxcTypography>
      )}

      {actionLabel && onAction && (
        <DxcButton
          label={actionLabel}
          mode="primary"
          onClick={onAction}
        />
      )}
    </DxcFlex>
  );
}
