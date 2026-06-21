/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#aa3bff',
          600: '#9333ea',
          700: '#7e22ce',
        },
        neonGreen: '#22c55e',
        neonCyan: '#06b6d4',
        neonAmber: '#f59e0b',
        panelBg: '#1a1b23',
        darkBg: '#0f1015'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        sporty: ['Orbitron', 'sans-serif'],
      }
    },
  },
  plugins: [],
}