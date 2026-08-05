interface StatusBarProps {
  metersCount: number;
  lastRefresh: string;
}

export function StatusBar({ metersCount, lastRefresh }: StatusBarProps) {
  const noun = metersCount === 1 ? 'meter' : 'meters';
  return (
    <div className="mb-4 flex flex-wrap justify-between gap-2 rounded border border-info bg-surface-alt px-4 py-2 text-sm">
      <span>{`Monitoring ${metersCount} ${noun}`}</span>
      <span className="text-muted">{`Last refresh: ${lastRefresh}`}</span>
    </div>
  );
}
