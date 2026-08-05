export function RateLimitWarning({ backoffRemaining }: { backoffRemaining: number }) {
  return (
    <div className="mb-4 rounded border border-warning bg-surface-alt px-4 py-2 text-sm text-warning">
      <strong>Rate Limited.</strong>{' '}
      {`SwitchBot API rate limit reached. Retry in ${backoffRemaining} seconds.`}
    </div>
  );
}
