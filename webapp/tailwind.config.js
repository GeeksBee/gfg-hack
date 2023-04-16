module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#5469F1",
        "secondary-blue": "#EEF0FE",
        "primary-orange": "#E15F35",
        "quaternary-blue": "#7d631b",
        "secondary-orange": "#FBEFEA",
        "tertiary-orange": "#FFA689",
        "card-bg-rose": "#FFE9D4",
        "prime-brown": "#E15F35",
        "prime-sky": "#0077B6",
        "prime-green": "#68BAAA",
        "prime-yellow": "#EEA052",
        "second-green": "#DEAC28",
        "primary-blue": "#F4FBFE",
      },
      boxShadow: {
        "3xl":
          "1px 1px 5px rgba(0, 0, 0, 0.201), -1px -1px 5px rgba(0, 0, 0, 0.201)",
        "4xl":
          "1px 1px 10px rgba(0, 0, 0, 0.101), -0.5px -0.5px 5px rgba(0, 0, 0, 0.101)",
        "shad-prime":
          "0.5px 0.5px 5px rgba(0, 0, 0, 0.101), -0.5px -0.5px 0px rgba(0, 0, 0, 0.101)",
      },
      backgroundImage: {
        "phone-img": "url('/iphoneX-logo.png')",
      },
      screens: {
        xs: { max: "480px" },
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("tailwind-scrollbar-hide"),
  ],
};
