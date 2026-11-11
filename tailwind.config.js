/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#FFFFFF',
          red: '#DC2626',
          deepRed: '#991B1B',
          black: '#111111',
          lightGray: '#F5F5F5',
          secondaryGray: '#737373',
        }
      }
    },
  },
  plugins: [],
}

