/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Court-inspired dark mode palette
        asphalt: {
          900: '#0f1115',
          800: '#171a21',
          700: '#242936',
        },
        // The "Play Hard" energy
        hoop: {
          orange: '#ff5722',
          glow: '#ff7043',
        },
        // The "Get Shredded" health vibe
        shred: {
          neon: '#ccff00', // Electric lime/yellow-green
          green: '#10b981',
        }
      },
      fontFamily: {
        // Impactful athletic fonts
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-orange': '0 0 15px rgba(255, 87, 34, 0.35)',
        'neon-shred': '0 0 15px rgba(204, 255, 0, 0.25)',
      }
    },
  },
  plugins: [],
}