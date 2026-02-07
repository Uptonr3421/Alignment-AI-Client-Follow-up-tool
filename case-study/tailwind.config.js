/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#E6511A',
          50: '#FDF2EE',
          100: '#F9E5DC',
          200: '#F3CCB9',
          300: '#EDB296',
          400: '#E79973',
          500: '#E17F50',
          600: '#E6511A',
          700: '#B84015',
          800: '#8A3010',
          900: '#5C200B',
        },
        charcoal: {
          DEFAULT: '#252422',
          50: '#5C5854',
          100: '#524E4A',
          200: '#484440',
          300: '#3E3A36',
          400: '#34302C',
          500: '#2A2622',
          600: '#252422',
          700: '#1E1D1B',
          800: '#171614',
          900: '#100F0D',
        },
        mist: {
          DEFAULT: '#f5f5f5',
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#f5f5f5',
          300: '#E8E8E8',
          400: '#DBDBDB',
          500: '#CECECE',
          600: '#C1C1C1',
          700: '#B4B4B4',
          800: '#A7A7A7',
          900: '#9A9A9A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      transitionTimingFunction: {
        'whisper': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
