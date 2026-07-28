import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { ThemeProvider } from '../ThemeProvider';
import { DEFAULT_THEME, THEME_STORAGE_KEY, readStoredTheme } from '../themes';

function renderSwitcher() {
  return render(
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>,
  );
}

describe('theme switching', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('falls back to the default theme when nothing is stored', () => {
    expect(readStoredTheme()).toBe(DEFAULT_THEME);
  });

  it('reads a persisted theme', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'ocean');
    expect(readStoredTheme()).toBe('ocean');
  });

  it('ignores unknown persisted values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    expect(readStoredTheme()).toBe(DEFAULT_THEME);
  });

  it('applies the default theme to the document on mount', () => {
    renderSwitcher();
    expect(document.documentElement.getAttribute('data-theme')).toBe(DEFAULT_THEME);
  });

  it('updates data-theme and localStorage when a theme is selected', async () => {
    renderSwitcher();
    await userEvent.selectOptions(screen.getByLabelText('Theme'), 'dark');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });
});
