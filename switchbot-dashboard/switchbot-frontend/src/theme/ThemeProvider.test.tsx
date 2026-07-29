import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import Navbar from '../components/Navbar';
import { ThemeProvider } from './ThemeProvider';
import { STORAGE_KEY } from './themes';

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('applies the persisted theme and updates on selection', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'ocean');
    render(
      <ThemeProvider>
        <Navbar connected />
      </ThemeProvider>,
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('ocean');

    await userEvent.selectOptions(screen.getByLabelText('Theme'), 'dark');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });
});
