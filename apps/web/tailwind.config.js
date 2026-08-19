/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6F0',
        ink: '#2B2622',
        terracotta: '#C1633D',
        sage: '#7A8B6F',
        border: '#E6DFD6',
        'dark-bg': '#1E1B18',
        'dark-text': '#EDE6DB',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
