// /** @type {import('tailwindcss').Config} */
// const withMT = require("@material-tailwind/react/utils/withMT");

//  const conf = withMT( {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: "class",
//   theme: {
//     extend: {

//       colors: {
//         primary: "rgb(19, 206, 183)",
//         secondary: "00725c",
//         dark: "rgb(67 66 74)",
//         light: "#f8f9fb",

//         lightText :"#f8f9fb",

//         darkText : "rgb(67 66 74)",

//         mediumDark : "rgb(57 57 57)",
//         inputLight : "rgb(230 233 237 / 73%)",
//         inputDark : "rgb(78 85 95 / 75%)",

//         lightButton : "rgb(19, 206, 183)",
//         darkButton : "rgb(0, 114, 92)",

//         cardBg1 : "rgb(255, 240, 181)",
//         cardBg2 : "rgb(181 228 255)",
//         cardBg3 : "rgb(190 246 210 / 78%)",
//         cardBg4 : "#abff8db0",
//       },

//       backgroundImage: {
//         // Existing gradient from your previous code
//         'custom-gradient': 'linear-gradient(90deg, hsla(197, 100%, 63%, 1) 0%, hsla(294, 100%, 55%, 1) 100%)',
       
//       },

//     },
//   },
//   plugins: [],
// })





// export default conf



/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

const conf = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "rgb(19, 206, 183)",
        secondary: "00725c",
        dark: "rgb(67 66 74)",
        light: "#f8f9fb",
        lightText: "#f8f9fb",
        darkText: "rgb(67 66 74)",
        mediumDark: "rgb(57 57 57)",
        inputLight: "rgb(230 233 237 / 73%)",
        inputDark: "rgb(78 85 95 / 75%)",
        lightButton: "#4caf50",
        darkButton: "rgb(0, 114, 92)",

        buyNowBUtton : "#00a246",
        addToCartBUtton : "#38b0f5",
        ratingButton: "#FAB12F",

        carBgDark : "#43424a80",
        cardBgDark2 : "#43424af2",



        cardBg1: "rgb(255, 240, 181)",
        cardBg2: "rgb(181 228 255)",
        cardBg3: "rgb(190 246 210 / 78%)",
        cardBg4: "#abff8db0",


        activeIconColor : "rgb(19, 206, 183)",
        inactiveIconColor : "#007fff"
      },
      backgroundImage: {
        // Existing gradient example:
        'custom-gradient': 'linear-gradient(90deg, hsla(197, 100%, 63%, 1) 0%, hsla(294, 100%, 55%, 1) 100%)',
        // Your provided gradient from earlier:
        'gradient': `linear-gradient(
          135deg,
          hsl(48deg 100% 85%) 0%,
          hsl(65deg 100% 85%) 14%,
          hsl(82deg 100% 85%) 24%,
          hsl(99deg 100% 85%) 34%,
          hsl(116deg 100% 85%) 44%,
          hsl(133deg 100% 85%) 54%,
          hsl(151deg 100% 85%) 64%,
          hsl(168deg 100% 85%) 74%,
          hsl(185deg 100% 85%) 85%,
          hsl(202deg 100% 85%) 98%
        )`,
        // New gradient you requested:
        'custom-gradient-2': `linear-gradient(
          90deg,
          hsla(141, 54%, 86%, 1) 0%,
          hsla(333, 73%, 85%, 1) 50%,
          hsla(211, 58%, 79%, 1) 100%
        )`,
        'custom-gradient-2-dark': 'linear-gradient(90deg, hsl(141deg 15.64% 55.69%) 0%, hsl(333deg 13.87% 51.52%) 50%, hsl(211deg 15.17% 49.06%) 100%)',

        'custom-gradient-3': `linear-gradient(90deg, hsla(208, 33%, 21%, 1) 0%, hsla(211, 36%, 46%, 1) 100%)`,
        'custom-gradient-4': `linear-gradient(90deg, hsla(197, 14%, 57%, 1) 0%, hsla(192, 17%, 94%, 1) 100%)`,



      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glassmorphism': {
          background: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(9.5px)',
          '-webkit-backdrop-filter': 'blur(9.5px)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
});

module.exports = conf;
