import { describe, expect, it } from 'vitest';
import { getDisplayName } from '../displayNames';

describe('getDisplayName', () => {
  it('maps known device names to plant identifiers', () => {
    expect(getDisplayName('Bedroom Meter')).toBe('第1蒸留塔 (T-101)');
    expect(getDisplayName('蛇棚')).toBe('貯蔵タンク (TK-901)');
  });

  it('falls back to the raw device name', () => {
    expect(getDisplayName('Unknown Meter')).toBe('Unknown Meter');
  });
});
