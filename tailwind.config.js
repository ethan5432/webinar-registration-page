/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18191D',
        body: '#4A4D55',
        muted: '#6B6E76',
        cream: '#F6F3EE',
        soft: '#F3F1EC',
        white: '#FFFFFF',
        line: '#E6E1D8',
        red: '#E1062C',
        'red-deep': '#B10522',
        night: '#14151A',
        'night-text': '#C8CAD1',
        good: '#0B9B6B',
      },
      fontFamily: {
        sans: ['Inter', 'Avenir Next', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['12px', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '800' }],
        caption: ['11px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '700' }],
        'small-body': ['15px', { lineHeight: '1.55', fontWeight: '400' }],
        legal: ['11px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        pill: '9999px',
        card: '28px',
        input: '14px',
      },
      transitionDuration: {
        '220': '220ms',
      },
    },
  },
  plugins: [],
};
