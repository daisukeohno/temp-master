import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('applies and persists the selected theme', async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const select = screen.getByLabelText('Theme');
    await userEvent.selectOptions(select, 'dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('temp-master-theme')).toBe('dark');
  });
});
