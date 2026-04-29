/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Luxury palette (from Grand Elysium) ──────────────────────────
        void:      '#050505',
        alabaster: '#F4F4F0',
        gold:      '#C5A059',
        charcoal:  '#1A1A1A',
        // ── HRS semantic aliases ─────────────────────────────────────────
        primary:   '#003580',   // kept for admin / pill buttons
        secondary: '#0071C2',
        accent:    '#C5A059',   // gold
        success:   '#22C55E',
        warning:   '#F97316',
        error:     '#EF4444',
        neutral: {
          light: '#050505',     // dark background
          DEFAULT: '#1A1A1A',
        },
        text: {
          primary:   '#F4F4F0',
          secondary: '#9A9A90',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"Inter"', 'sans-serif'],
        sans:    ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeIn:  'fadeIn 0.4s ease-in-out',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
