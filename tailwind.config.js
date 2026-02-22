/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          600: '#4f46e5',
          700: '#4338ca',
          950: '#1e1b4b',
        },
        slate: {
          950: '#020617', // Deeper black for premium dark mode
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}