interface RateLimitWarningProps {
  backoffRemaining: number
}

export function RateLimitWarning({ backoffRemaining }: RateLimitWarningProps) {
  return (
    <div id="rate-limit-warning" className="alert alert-warning">
      <span>
        <strong>Rate Limited.</strong>{' '}
        <span id="rate-limit-text">
          SwitchBot API rate limit reached. Retry in {backoffRemaining} seconds.
        </span>
      </span>
    </div>
  )
}
