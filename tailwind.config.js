/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "dim",
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#006B7F",
          secondary: "#6fa9b7",
          accent: "#f34169",
          error: "#f84f4f",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#0cc19a",
          secondary: "#6fa9b7",
          accent: "#f34169",
          "base-100": "#1c2731",
          "base-200": "#1e2a35",
          "base-300": "#1a383c",
          "base-content": "#fafcfc",
          error: "#f67777",
        },
      },
    ],
  },
};
