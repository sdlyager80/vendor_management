import { DxcFlex, DxcHeading, DxcParagraph, DxcButton } from '@dxc-technology/halstack-react';

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
      gap="1.5rem"
      alignItems="center"
      justifyContent="center"
      style={{ padding: '4rem 2rem', textAlign: 'center' }}
    >
      {icon && <div style={{ fontSize: '3rem', opacity: 0.3 }}>{icon}</div>}

      <DxcHeading level={3} text={title} />

      {description && (
        <DxcParagraph style={{ maxWidth: '500px', color: '#666' }}>
          {description}
        </DxcParagraph>
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
