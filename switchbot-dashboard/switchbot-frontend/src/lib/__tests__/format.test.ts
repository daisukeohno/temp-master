import { describe, expect, it } from 'vitest';
import { formatClockTime, formatTimestamp, pad2 } from '../format';

describe('pad2', () => {
  it('pads single digits', () => {
    expect(pad2(0)).toBe('00');
    expect(pad2(9)).toBe('09');
    expect(pad2(10)).toBe('10');
  });
});

describe('formatTimestamp', () => {
  const timestamp = new Date(2024, 2, 5, 8, 7, 0); // Tue Mar 5 2024 08:07 local

  it('formats hour and day scales as HH:MM', () => {
    expect(formatTimestamp(timestamp, 'hour')).toBe('08:07');
    expect(formatTimestamp(timestamp, 'day')).toBe('08:07');
  });

  it('formats week scale as weekday + hour', () => {
    expect(formatTimestamp(timestamp, 'week')).toBe('Tue 08');
  });

  it('formats month and year scales as month + day', () => {
    expect(formatTimestamp(timestamp, 'month')).toBe('Mar 5');
    expect(formatTimestamp(timestamp, 'year')).toBe('Mar 5');
  });
});

describe('formatClockTime', () => {
  it('formats HH:MM:SS', () => {
    expect(formatClockTime(new Date(2024, 0, 1, 4, 5, 6))).toBe('04:05:06');
  });
});
