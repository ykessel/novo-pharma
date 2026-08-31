/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#C7F04A',
          ink: '#111409',
          text: '#4E6B0A',
        },
        ink: {
          DEFAULT: '#0D0F12',
          surface: '#15181D',
          elevated: '#1D2128',
          line: '#22262D',
        },
        paper: {
          DEFAULT: '#F3F5F1',
          surface: '#FFFFFF',
          elevated: '#E9EDE3',
          line: '#E0E4DC',
        },
        info: { DEFAULT: '#55D3E0' },
        rx: { DEFAULT: '#FF8B78' },
        warning: { DEFAULT: '#FFC46B' },
      },
      fontFamily: {
        sans: ['SpaceGrotesk-Regular'],
        medium: ['SpaceGrotesk-Medium'],
        bold: ['SpaceGrotesk-Bold'],
        mono: ['JetBrainsMono-Regular'],
      },
      spacing: { touch: '44px' },
      borderRadius: { card: '18px', button: '14px' },
    },
  },
  plugins: [],
};
