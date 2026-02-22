/** @type {import('tailwindcss').Config} */
export default {
     darkMode: 'class',
  content: [
    
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This tells Tailwind to look at your files
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          600: '#4f46e5',
          700: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}