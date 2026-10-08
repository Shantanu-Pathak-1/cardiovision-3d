import { CircleDot } from 'lucide-react';

export function ConnectionBadge({ children = 'PREVIEW / SERVICES OFFLINE', tone = 'quiet' }: { children?: string; tone?: 'quiet' | 'warning' }) {
  return (
    <span className={`connection-badge ${tone === 'warning' ? 'connection-badge-warning' : ''}`}>
      <CircleDot size={12} aria-hidden="true" />
      {children}
    </span>
  );
}
