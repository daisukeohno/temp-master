import type { MeterDevice, TimeScale } from '../api';
import { DISPLAY_NAMES, STALE_METER_THRESHOLD_MS } from '../constants';

export function getDisplayName(deviceName: string): string {
  return DISPLAY_NAMES[deviceName] ?? deviceName;
}

export function isStaleMeter(meter: MeterDevice, now: number = Date.now()): boolean {
  if (!meter.last_updated) {
    return true;
  }
  const lastUpdated = new Date(meter.last_updated).getTime();
  if (Number.isNaN(lastUpdated)) {
    return true;
  }
  return now - lastUpdated >= STALE_METER_THRESHOLD_MS;
}

export function partitionMeters(meters: MeterDevice[], now: number = Date.now()) {
  const active: MeterDevice[] = [];
  const stale: MeterDevice[] = [];
  for (const meter of meters) {
    (isStaleMeter(meter, now) ? stale : active).push(meter);
  }
  return { active, stale };
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`;
}

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatTimestamp(timestamp: string, timeScale: TimeScale): string {
  const date = new Date(timestamp);
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());

  switch (timeScale) {
    case 'hour':
    case 'day':
      return `${hours}:${minutes}`;
    case 'week':
      return `${DAY_SHORT[date.getDay()]} ${hours}`;
    case 'month':
    case 'year':
      return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
    default:
      return date.toLocaleString();
  }
}

export function formatClockTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}
