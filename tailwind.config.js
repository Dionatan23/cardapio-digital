/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg-interno.jpeg')"
      },
      textColor:{
        "color": "#f59e0b"
      },
      backgroundColor:{
        "yellom": "#CFA319"
      }
    },
  },
  plugins: [],
}

