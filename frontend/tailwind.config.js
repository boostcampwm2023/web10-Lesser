/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-1": "#2A491D",
        "middle-green": "#3A5624",
        "dark-green": "#032809",
        "light-green": "#66770B",
        "true-white": "#FFFFFF",
        "text-gray": "#9E9E9E",
      },
    },
  },
  plugins: [],
};
