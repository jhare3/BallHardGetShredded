// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'nba-navy': '#002B5C',
        'nba-red': '#C8102E',
        'court-gold': '#FDB927',
        'off-white': '#F4F4F4',
      },
      fontFamily: {
        // Impact or similar block fonts defined in CSS
        'jersey': ['Impact', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}