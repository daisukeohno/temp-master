import { describe, expect, it } from 'vitest';
import { formatTimestamp, getDisplayName, isStaleMeter, partitionMeters } from './meters';
import { makeMeter } from '../test/fixtures';
import { STALE_METER_THRESHOLD_MS } from '../constants';

describe('meter utils', () => {
  it('maps known device names and passes through unknown ones', () => {
    expect(getDisplayName('Living Meter')).toBe('第2蒸留塔 (T-102)');
    expect(getDisplayName('Something Else')).toBe('Something Else');
  });

  it('treats meters without or with old updates as stale', () => {
    const now = Date.now();
    expect(isStaleMeter(makeMeter({ last_updated: null }), now)).toBe(true);
    expect(isStaleMeter(makeMeter({ last_updated: 'not-a-date' }), now)).toBe(true);
    expect(
      isStaleMeter(
        makeMeter({ last_updated: new Date(now - STALE_METER_THRESHOLD_MS - 1000).toISOString() }),
        now,
      ),
    ).toBe(true);
    expect(isStaleMeter(makeMeter({ last_updated: new Date(now - 1000).toISOString() }), now)).toBe(
      false,
    );
  });

  it('partitions active and stale meters', () => {
    const fresh = makeMeter({ device_id: 'fresh' });
    const old = makeMeter({ device_id: 'old', last_updated: null });
    const { active, stale } = partitionMeters([fresh, old]);
    expect(active.map((m) => m.device_id)).toEqual(['fresh']);
    expect(stale.map((m) => m.device_id)).toEqual(['old']);
  });

  it('formats timestamps per time scale', () => {
    const timestamp = new Date(2024, 0, 15, 9, 5).toISOString();
    expect(formatTimestamp(timestamp, 'hour')).toBe('09:05');
    expect(formatTimestamp(timestamp, 'week')).toBe('Mon 09');
    expect(formatTimestamp(timestamp, 'month')).toBe('Jan 15');
  });
});
