/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        sprint: {
          bg: '#F9F6ED',
          sidebar: '#123C2C',
          gold: '#C89B3C',
          goldLight: '#DEBC65',
          textDark: '#123C2C',
          textMuted: '#8B9A93',
          cardBg: '#FFFFFF',
        }
      },
      fontFamily: {
        title: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(18, 60, 44, 0.05)',
      }
    },
  },
  plugins: [],
}
