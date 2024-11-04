// front-end/tailwind.config.js
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Custom primary color
        secondary: '#1E293B', // Custom secondary color
      },
    },
  },
  plugins: [],
};
