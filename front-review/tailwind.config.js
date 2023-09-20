/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      height: { 'auth': "600px" },
      width:{'auth': "500px"},
      colors: {
        'dark': "rgb(32 38 52)",
        'dark-soft': "rgb(41 48 68)",
      },
    },
  },
  plugins: [],
};
