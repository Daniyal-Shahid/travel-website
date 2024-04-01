/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],

  darkMode: 'class', // Enable dark mode using class-based selector
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#1a202c', // Background color for dark mode
          text: '#e2e8f0', // Text color for dark mode
          primary: '#4a5568', // Primary color for dark mode
          secondary: '#2d3748', // Secondary color for dark mode
          accent: '#5e81ac', // Accent color for dark mode
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'], // Enable dark mode variant for background color
      textColor: ['dark'], // Enable dark mode variant for text color
      borderColor: ['dark'], // Enable dark mode variant for border color
    },
  },
};


