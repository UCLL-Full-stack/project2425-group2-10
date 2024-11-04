// tailwind.config.js

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {      
      colors: {
      primary: '#2563EB', // Custom primary color
      },
    },
  },
  plugins: [],
};
