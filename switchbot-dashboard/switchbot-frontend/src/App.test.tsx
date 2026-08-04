import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { ThemeProvider } from './theme/ThemeProvider';
import { makeHistory, makeMeter } from './test/fixtures';

function jsonResponse(body: unknown): Response {
  return { ok: true, status: 200, json: async () => body } as Response;
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/api/meters/')) {
          return Promise.resolve(jsonResponse({ history: makeHistory() }));
        }
        if (url.includes('/api/meters')) {
          return Promise.resolve(
            jsonResponse({ meters: [makeMeter()], last_updated: new Date().toISOString() }),
          );
        }
        if (url.includes('/api/status')) {
          return Promise.resolve(
            jsonResponse({
              configured: true,
              meters_count: 1,
              is_rate_limited: false,
              backoff_remaining: 0,
              last_api_call: 0,
              collection_interval: 120,
            }),
          );
        }
        return Promise.reject(new Error(`unexpected fetch ${url}`));
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the dashboard with fetched meters', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    );

    expect(screen.getByText('Temp Master Dashboard')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Monitoring 1 meter')).toBeInTheDocument();
    });
    expect(screen.getByText('第1蒸留塔 (T-101)')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Refresh Data' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download Backup' })).toBeInTheDocument();
  });
});
