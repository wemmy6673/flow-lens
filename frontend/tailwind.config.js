/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      ink: "#0a0e14",
      panel: "#10141b",
      graticule: "#1c212b",
      ink_text: "#e7ebf1",
      muted: "#7d8798",
      down: "#22e5a0",
      up: "#f97316",
      ok: "#22e5a0",
      bad: "#f87171",
    },
    // ...
  },
},
  plugins: [],
} 