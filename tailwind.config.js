/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#495BFF",
        lightPrimaryColor: "#6A77F3",
        whiteColor: "#FFFFFF",
      },
      backgroundImage: {
        home: "url('https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI')",
        skill: "url('/assets/img/skill-1.png')"
      }
    },
  },
  plugins: [],
};
