/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
    },
  },
  plugins: [],
};
