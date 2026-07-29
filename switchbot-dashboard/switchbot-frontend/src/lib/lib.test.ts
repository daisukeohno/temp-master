import { describe, expect, it } from 'vitest';
import { getDisplayName } from './displayNames';
import { formatTimestamp } from './format';
import { isStaleMeter, partitionMeters } from './meters';
import type { Meter } from '../types';

function meter(overrides: Partial<Meter> = {}): Meter {
  return {
    device_id: 'ID1',
    device_name: 'Bedroom Meter',
    device_type: 'Meter',
    last_updated: new Date().toISOString(),
    ...overrides,
  };
}

describe('getDisplayName', () => {
  it('maps known device names and passes through unknown ones', () => {
    expect(getDisplayName('Bedroom Meter')).toBe('第1蒸留塔 (T-101)');
    expect(getDisplayName('Unknown Device')).toBe('Unknown Device');
  });
});

describe('isStaleMeter', () => {
  it('treats missing or invalid timestamps as stale', () => {
    expect(isStaleMeter(meter({ last_updated: null }))).toBe(true);
    expect(isStaleMeter(meter({ last_updated: 'not-a-date' }))).toBe(true);
  });

  it('treats readings older than 7 days as stale', () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
    expect(isStaleMeter(meter({ last_updated: eightDaysAgo }))).toBe(true);
    expect(isStaleMeter(meter())).toBe(false);
  });
});

describe('partitionMeters', () => {
  it('splits active and stale meters', () => {
    const stale = meter({ device_id: 'ID2', last_updated: null });
    const { active, stale: staleList } = partitionMeters([meter(), stale]);
    expect(active).toHaveLength(1);
    expect(staleList).toEqual([stale]);
  });
});

describe('formatTimestamp', () => {
  const date = new Date(2024, 0, 3, 9, 5);

  it('formats per time scale', () => {
    expect(formatTimestamp(date, 'hour')).toBe('09:05');
    expect(formatTimestamp(date, 'day')).toBe('09:05');
    expect(formatTimestamp(date, 'week')).toBe('Wed 09');
    expect(formatTimestamp(date, 'month')).toBe('Jan 3');
    expect(formatTimestamp(date, 'year')).toBe('Jan 3');
  });
});
