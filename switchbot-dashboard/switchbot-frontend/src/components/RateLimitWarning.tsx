interface RateLimitWarningProps {
  backoffRemaining: number
}

export default function RateLimitWarning({ backoffRemaining }: RateLimitWarningProps) {
  return (
    <div
      className="mb-4 rounded border border-border bg-surface px-4 py-3 text-sm"
      style={{ borderLeft: '4px solid var(--color-warning)' }}
    >
      <strong>Rate Limited.</strong>{' '}
      {`SwitchBot API rate limit reached. Retry in ${backoffRemaining} seconds.`}
    </div>
  )
}
