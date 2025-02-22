/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-light": "#388E3C",
        "primary-light-2": "#108910",
        "primary-light-3": "#4CAF50",
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

