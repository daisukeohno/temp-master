import { pad2 } from '../utils'

interface StatusBarProps {
  metersCount: number
  lastRefresh: Date
}

export function StatusBar({ metersCount, lastRefresh }: StatusBarProps) {
  const noun = metersCount === 1 ? 'meter' : 'meters'
  const time = `${pad2(lastRefresh.getHours())}:${pad2(
    lastRefresh.getMinutes(),
  )}:${pad2(lastRefresh.getSeconds())}`

  return (
    <div id="status-bar" className="alert alert-info">
      <span id="status-meters-count">
        Monitoring {metersCount} {noun}
      </span>
      <span id="status-last-refresh">Last refresh: {time}</span>
    </div>
  )
}
