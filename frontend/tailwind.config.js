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
        "dark-gray": "#696969",
        "text-gray": "#9E9E9E",
        "text-black": "#1A1414",
        "error-red": "#E25667",
        "white-transparent": "rgba(255, 255, 255, 0.29)",
      },
      fontFamily: {
        pretendard: ["pretendard"],
      },
      fontSize: {
        xxl: "2.5rem", //40px
        xl: "2rem", //32px
        l: "1.75rem", //28px
        m: "1.5rem", //24px
        s: "1.25rem", //20px
        xs: "1.125rem", //18px
        xxs: "0.875rem", //14px
      },
      boxShadow: {
        box: "8px 8px 25px 0px #00000051",
      },
      dropShadow: {
        box: "8px 8px 25px 0px #00000051",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
