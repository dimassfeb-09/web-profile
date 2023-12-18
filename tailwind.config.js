/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F8F7F1",
        darkColor: "#0e1111",
        secondary: "#609A82",
        red2nd: "#FF6666",
        green2nd: "#5DBE72",
      },
    },
  },
  plugins: [],
};
