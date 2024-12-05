import vue from "@vitejs/plugin-vue";

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '15': "repeat(15, minmax(0, 1fr));",
        "16": "repeat(16, minmax(0, 1fr));",
        "17": "repeat(17, minmax(0, 1fr));",
        "18": "repeat(18, minmax(0, 1fr));",
        "19": "repeat(19, minmax(0, 1fr));",
        "20": "repeat(20, minmax(0, 1fr));",
      },
      gridColumn: {
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
        "span-17": "span 17 / span 17",
      }
    },
  },
  plugins: [vue()],
}

