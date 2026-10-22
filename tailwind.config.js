/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#060913',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141E33',
          700: '#1E2D4A',
          600: '#2C3E63',
        },
        volt: {
          cyan: '#00E5FF',
          blue: '#0284C7',
          sky: '#38BDF8',
          purple: '#A855F7',
          violet: '#7C3AED',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'flow': 'flow 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
