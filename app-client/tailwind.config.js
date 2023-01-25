/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-body": "#0f172a", //"#0A2647",
        themelight: "#205295",
        themelighter: "#2C74B3",
        themeborder: "#2C74B3",
        themetext: "#FFFFFF",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
