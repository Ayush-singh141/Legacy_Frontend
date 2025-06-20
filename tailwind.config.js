/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vintage': {
          50: '#f9f7f4',
          100: '#e8e2d9',
          200: '#d7c8b8',
          300: '#c2a990',
          400: '#ab8c6e',
          500: '#967555',
          600: '#7d5f45',
          700: '#634a37',
          800: '#4a372a',
          900: '#32251c',
        },
        'sepia': {
          50: '#fcf9f6',
          100: '#f5e6d3',
          200: '#ebd0ae',
          300: '#deb584',
          400: '#d19659',
          500: '#c47d3a',
          600: '#a66530',
          700: '#854f27',
          800: '#633a1f',
          900: '#422616',
        }
      },
      fontFamily: {
        'vintage': ['Playfair Display', 'serif'],
        'handwritten': ['Dancing Script', 'cursive']
      }
    },
  },
  plugins: [],
} 