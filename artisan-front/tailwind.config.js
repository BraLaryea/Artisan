/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f9aad0",
        secondary: "#91398b",
        accent: "#502779",
        text: "#FFFFFF",
      },
      fontFamily: {
        "poppins-medium": ["Poppins Medium", "sans-serif"],
        "poppins-light": ["Poppins Light", "sans-serif"],
      },
    },
  },
  plugins: [],
};
