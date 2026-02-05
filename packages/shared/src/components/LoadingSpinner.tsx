import { DxcSpinner, DxcFlex } from '@dxc-technology/halstack-react';

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ text = 'Loading...', fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <DxcFlex direction="column" gap="var(--spacing-gap-m)" alignItems="center" justifyContent="center">
      <DxcSpinner mode="large" label={text} />
    </DxcFlex>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 9999,
      }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-padding-xl)', textAlign: 'center' }}>
      {content}
    </div>
  );
}
