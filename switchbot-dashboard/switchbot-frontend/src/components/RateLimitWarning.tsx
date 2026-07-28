export function RateLimitWarning({ backoffRemaining }: { backoffRemaining: number }) {
  return (
    <div className="alert alert-warning">
      <strong>Rate Limited.</strong>{' '}
      <span>{`SwitchBot API rate limit reached. Retry in ${backoffRemaining} seconds.`}</span>
    </div>
  )
}
