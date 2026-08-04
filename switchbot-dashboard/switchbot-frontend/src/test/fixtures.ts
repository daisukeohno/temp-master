import type { MeterDevice, MeterReading } from '../api';

export function makeMeter(overrides: Partial<MeterDevice> = {}): MeterDevice {
  return {
    device_id: 'ABC123',
    device_name: 'Bedroom Meter',
    device_type: 'Meter',
    hub_device_id: null,
    current_temperature: 24.5,
    current_humidity: 48,
    battery: 90,
    last_updated: new Date().toISOString(),
    ...overrides,
  };
}

export function makeHistory(count = 3): MeterReading[] {
  const base = Date.now() - count * 60_000;
  return Array.from({ length: count }, (_, index) => ({
    timestamp: new Date(base + index * 60_000).toISOString(),
    temperature: 20 + index,
    humidity: 40 + index,
    battery: 90,
  }));
}
