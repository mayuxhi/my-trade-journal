/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0b0f17',
        cardBg: '#131926',
        cardHover: '#1c2536',
        accentBlue: '#2563eb',
        accentGreen: '#10b981',
        accentRed: '#ef4444',
      }
    },
  },
  plugins: [],
}
