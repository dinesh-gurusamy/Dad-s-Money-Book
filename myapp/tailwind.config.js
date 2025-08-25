/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Your custom color
        secondary: "rgb(34,197,94)", // Another example
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // This becomes the default
      },
    },
  },
  plugins: [],
}
