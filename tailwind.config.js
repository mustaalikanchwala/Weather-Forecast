/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', // Scan index.html for Tailwind classes
    './script.js'   // Scan script.js for any dynamic classes
  ],
  theme: {
    extend: {}, // Add customizations here if needed
  },
  plugins: [], // Add plugins if needed
}
