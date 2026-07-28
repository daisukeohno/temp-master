import { describe, expect, it } from 'vitest';
import { STALE_METER_THRESHOLD_MS, isStaleMeter, partitionMeters } from '../stale';

const NOW = new Date('2024-06-10T12:00:00Z').getTime();

describe('isStaleMeter', () => {
  it('treats missing timestamps as stale', () => {
    expect(isStaleMeter({ last_updated: null }, NOW)).toBe(true);
  });

  it('treats unparseable timestamps as stale', () => {
    expect(isStaleMeter({ last_updated: 'not-a-date' }, NOW)).toBe(true);
  });

  it('is stale at or beyond the 7 day threshold', () => {
    const atThreshold = new Date(NOW - STALE_METER_THRESHOLD_MS).toISOString();
    expect(isStaleMeter({ last_updated: atThreshold }, NOW)).toBe(true);
  });

  it('is fresh just inside the threshold', () => {
    const fresh = new Date(NOW - STALE_METER_THRESHOLD_MS + 1000).toISOString();
    expect(isStaleMeter({ last_updated: fresh }, NOW)).toBe(false);
  });
});

describe('partitionMeters', () => {
  it('splits meters into active and stale buckets', () => {
    const { active, stale } = partitionMeters([
      { last_updated: new Date().toISOString() },
      { last_updated: null },
    ]);
    expect(active).toHaveLength(1);
    expect(stale).toHaveLength(1);
  });
});
