/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        apple: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 0 25px rgba(255,255,255,0.18), 0 0 55px rgba(180,180,180,0.12)",
      },
      backgroundImage: {
        "silver-gradient":
          "linear-gradient(90deg, #ffffff 0%, #d7d7d7 40%, #9f9f9f 100%)",
      },
    },
  },
  plugins: [],
};
