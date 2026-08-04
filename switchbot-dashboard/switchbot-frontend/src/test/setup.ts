import '@testing-library/jest-dom/vitest';

// jsdom has no ResizeObserver, which Recharts' ResponsiveContainer requires.
class ResizeObserverStub implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver ??= ResizeObserverStub;
