/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#fffbg00",
        "primary-light-fb" : "#3b5998",
        "primary-light-ins" : "#E1306C",
        "primary-light-x" : "#000000",
        "primary-light-in" : "#3b5998",
        "primary-light-zl" : "#0068FF",
        "primary-light-ytb" : "#FF0000",
        "secondary": "#00b050",
        "secondary-light": "#0b1a78" 
      },
    },
  },
  plugins: [],
}

