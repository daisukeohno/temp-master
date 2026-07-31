import { formatClockTime } from '../utils/format'

interface StatusBarProps {
  metersCount: number
  lastRefresh: Date
}

export default function StatusBar({ metersCount, lastRefresh }: StatusBarProps) {
  const noun = metersCount === 1 ? 'meter' : 'meters'

  return (
    <div
      className="mb-4 flex flex-wrap justify-between gap-2 rounded border border-border bg-surface px-4 py-3 text-sm"
      style={{ borderLeft: '4px solid var(--color-accent)' }}
    >
      <span>{`Monitoring ${metersCount} ${noun}`}</span>
      <span className="text-muted">{`Last refresh: ${formatClockTime(lastRefresh)}`}</span>
    </div>
  )
}
