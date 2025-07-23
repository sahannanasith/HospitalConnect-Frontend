/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Simplified content path
  ],
  theme: {
    extend: {
      // Custom colors, fonts, etc. can be defined here if needed
      // For this version, we'll keep it simple and use default Tailwind colors
    },
  },
  plugins: [], // No longer need tailwindcss-animate unless you add custom animations
};