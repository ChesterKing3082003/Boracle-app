/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: '#EE4B2B',
        green: '#40D492',
        yellow: '#f9b710',
      }
    },
  },
  plugins: [],
}