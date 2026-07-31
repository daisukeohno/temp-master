/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        primary: 'var(--color-primary)',
        danger: 'var(--color-danger)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
      },
    },
  },
  plugins: [],
}
