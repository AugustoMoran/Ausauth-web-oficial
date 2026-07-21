/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#8B5CF6', // Electric Violet
          500: '#7C3AED', // Deeper Violet
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#2E1065',
        },
        secondary: {
          400: '#3B82F6', // Blue Neon
          500: '#2563EB',
        },
        dark: {
          pure: '#000000',
          rich: '#050505',
          card: 'rgba(20, 20, 25, 0.7)',
        },
        accent: {
          400: '#FF0000',
          500: '#CC0000',
          600: '#999999',
        },
        pearl: {
          DEFAULT: '#F5F5F5', // body bg — light gray
          dark:    '#E8E8E8', // borders / dividers
        },
        ink: {
          DEFAULT: '#000000', // black for text
          soft:    '#2A2A2A', // dark gray for text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
};
