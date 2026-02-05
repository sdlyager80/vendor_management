import { DxcHeading, DxcFlex, DxcButton } from '@dxc-technology/halstack-react';

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
      style={{ marginBottom: '2rem' }}
    >
      <div>
        <DxcHeading level={1} text={title} />
        {subtitle && (
          <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '1rem' }}>
            {subtitle}
          </p>
        )}
      </div>

      {actions && actions.length > 0 && (
        <DxcFlex gap="0.75rem">
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
