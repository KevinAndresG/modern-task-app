/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neu: {
          bg:    '#1a1e2e',
          alt:   '#171b29',
          text:  '#e2e8f0',
          muted: 'rgba(148,163,184,0.65)',
        },
        state: {
          new:      '#818cf8',
          active:   '#fbbf24',
          resolved: '#34d399',
          closed:   '#94a3b8',
        },
        primary: {
          400: '#a5b4fc',
          500: '#818cf8',
          600: '#6366f1',
        },
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        neu:        '-5px -5px 14px rgba(255,255,255,0.05), 5px 5px 14px rgba(0,0,0,0.50)',
        'neu-sm':   '-3px -3px 8px rgba(255,255,255,0.05),  3px 3px 8px rgba(0,0,0,0.45)',
        'neu-hover':'-7px -7px 18px rgba(255,255,255,0.05), 7px 7px 18px rgba(0,0,0,0.55)',
        'neu-inset':'inset 3px 3px 8px rgba(0,0,0,0.40), inset -2px -2px 6px rgba(255,255,255,0.03)',
      },
    },
  },
  plugins: [],
}
