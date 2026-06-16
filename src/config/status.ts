export type StatusLevel = 'operational' | 'degraded' | 'offline';

export interface ServiceStatus {
  name: string;
  status: StatusLevel;
  lastUpdated: string;
  description?: string;
  critical?: boolean;
}

const NOW = '2026-06-16T00:00:00.000Z';

export const systemStatus: ServiceStatus[] = [
  { name: 'Website', status: 'operational', lastUpdated: NOW, description: 'All systems normal',              critical: true },
  { name: 'Email',   status: 'offline', lastUpdated: NOW, description: 'Direct email contact is disabled; use the social links or contact page.', critical: false },
  { name: 'API',     status: 'operational', lastUpdated: NOW, description: 'Content & Website endpoints',    critical: false },
];

export function getOverallStatus(): StatusLevel {
  const total = systemStatus.length;
  const offline = systemStatus.filter((s) => s.status === 'offline');
  const degraded = systemStatus.filter((s) => s.status === 'degraded');

  if (offline.some((s) => s.critical)) return 'offline';
  if (total > 0 && offline.length / total >= 0.5) return 'offline';
  if (degraded.some((s) => s.critical)) return 'degraded';
  if (offline.length > 0 || degraded.length > 0) return 'degraded';
  return 'operational';
}

export function getStatusColor(status: StatusLevel): string {
  return { operational: '#22c55e', degraded: '#f59e0b', offline: '#ef4444' }[status];
}

export function getStatusLabel(status: StatusLevel): string {
  return { operational: 'All systems normal', degraded: 'Degraded performance', offline: 'Service offline' }[status];
}
