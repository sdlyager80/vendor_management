import { DxcChip } from '@dxc-technology/halstack-react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
}

const statusColorMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  ACTIVE: 'success',
  APPROVED: 'success',
  COMPLETED: 'success',
  ACCEPTED: 'success',
  PAID: 'success',
  BILLED: 'success',

  INACTIVE: 'error',
  REJECTED: 'error',
  TERMINATED: 'error',
  CANCELLED: 'error',

  PENDING: 'warning',
  PENDING_DOCUMENTATION: 'warning',
  UNDER_REVIEW: 'warning',
  PENDING_REVIEW: 'warning',
  IN_PROGRESS: 'warning',

  PROSPECTIVE: 'info',
  ASSIGNED: 'info',
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const color = variant || statusColorMap[status] || 'info';
  const label = status.split('_').map(word =>
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');

  return (
    <DxcChip
      label={label}
      color={color}
      size="small"
    />
  );
}
