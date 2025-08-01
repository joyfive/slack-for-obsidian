/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"KoPubWorld Dotum"', '"Pretendard"', "sans-serif"],
        serif: ['"RIDIBatang"', '"KoPubWorld Batang"', "serif"],
        design: ['"Yeongdo-Rg"', '"Yeongdo-Bd"', '"Yeongdo-It"'],
        mono: ['"KoPubWorld Dotum Mono"', '"Pretendard Mono"', "monospace"],
      },
      colors: {
        "legal-yellow": "#FAF0DE",
        "legal-line": "#E6E3B4", // legal yellow보다 조금 어두운 색
        "legal-brown": "#DA8F52", // legal yellow보다 조금 어두운 갈색
        "legal-dark-brown": "#CD7228", // legal brown보다 조금 어두운 갈색
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
