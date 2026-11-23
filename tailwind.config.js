/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          pastel: '#F8DDE6',
          blush: '#F3C6D5',
          cream: '#FFF9F5',
          lavender: '#E9E2F5',
          rose: '#C77D98',
          brown: '#59434A',
          deepRose: '#A65B77',
          softBg: '#FDF7F4',
          cardBg: '#FFFFFF',
          petal: '#FDECEF',
          gold: '#E5B869',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cursive: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'romantic': '0 10px 30px -10px rgba(199, 125, 152, 0.15)',
        'romantic-lg': '0 20px 40px -15px rgba(199, 125, 152, 0.22)',
        'polaroid': '0 8px 24px -6px rgba(89, 67, 74, 0.12), 0 2px 6px -1px rgba(89, 67, 74, 0.08)',
        'glow': '0 0 25px rgba(243, 198, 213, 0.6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.12)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
