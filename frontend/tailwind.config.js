/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        "middle-green": "#3A5624",
        "dark-green": "#032809",
        "light-green": "#66770B",
        "dartk-gray": "#696969",
        "text-gray": "#9E9E9E",
        "text-blck": "#1A1414",
        "error-red": "#E25667",
      },
      fontFamily: {
        pretendard: ["pretendard"],
      },
      fontSize: {
        xxl: "40px",
        xl: "32px",
        l: "28px",
        m: "24px",
        s: "20px",
        xs: "18px",
        xxs: "14px",
      },
      boxShadow: {
        box: "8px 8px 25px 0px #00000051",
      },
    },
  },
  plugins: [],
};
