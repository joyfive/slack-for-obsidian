/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "legal-yellow": "#FFF9E6",
        "legal-line": "#E6E3B4", // legal yellow보다 조금 어두운 색
      },
      backgroundImage: {
        "legal-pad": `
          linear-gradient(to right, transparent 80px, #FFC2D8 80px, #FFC2D8 81px, transparent 82px),
          repeating-linear-gradient(
            to bottom,
            #C7E2EE 0px,
            #C7E2EE 1px,
            transparent 1px,
            transparent 32px
          )
        `,
      },
    },
  },
  plugins: [],
}
