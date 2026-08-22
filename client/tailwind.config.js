/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#161310",
          900: "#1C1814",
          800: "#252019",
          700: "#332B22",
          600: "#4A4033",
        },
        paper: {
          50: "#FBF8F2",
          100: "#F5EFE1",
          200: "#EBE2CC",
        },
        ember: {
          400: "#FF9757",
          500: "#FF7A33",
          600: "#E4611E",
          700: "#C4501A",
        },
        sage: {
          400: "#8FAE7B",
          500: "#7FA46B",
        },
        dusk: {
          400: "#8B8FA8",
          500: "#6B7091",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
