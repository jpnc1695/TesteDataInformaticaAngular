import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        header: '#6b6b6b',
        ink:    '#333333',
        muted:  '#8a8a8a',
        fab:    '#e53935',
        link:   '#1976d2',
      },
    },
  },
  plugins: [],
} satisfies Config;