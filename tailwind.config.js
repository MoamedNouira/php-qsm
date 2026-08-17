/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070b14',
          900: '#0b1120',
          850: '#0e1626',
          800: '#111a2e',
          750: '#16203a',
          700: '#1c2840',
          600: '#283656',
        },
        brand: {
          50: '#eef4ff',
          100: '#dbe7ff',
          200: '#bcd3ff',
          300: '#8eb3ff',
          400: '#5d8aff',
          500: '#3b66ff',
          600: '#2747f0',
          700: '#1f37c9',
          800: '#1e30a1',
          900: '#1e2d80',
        },
        accent: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        ok: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        bad: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        warn: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,102,255,0.25), 0 10px 40px -10px rgba(59,102,255,0.45)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 50px -20px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
};
