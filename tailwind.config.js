/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F766E',
          secondary: '#E6F4F1',
        },
        mint: {
          100: '#E6F4F1',
        },
        accent: {
          DEFAULT: '#F97316',
        },
        rx: {
          DEFAULT: '#DC2626',
        },
        success: {
          DEFAULT: '#16A34A',
        },
        warning: {
          DEFAULT: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter-Regular'],
        medium: ['Inter-Medium'],
        bold: ['Inter-Bold'],
      },
      spacing: {
        touch: '44px',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
    },
  },
  plugins: [],
};
