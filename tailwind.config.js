// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Optional: If you want to use Monomakh through Tailwind utilities
        // sans: ['Monomakh', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
