/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#12141A',
        parchment: '#FBF6EC',
        navy: '#1C2B6B',
        gold: '#C6821E',
        goldDeep: '#8F5A12',
        amber: '#E8A23A',
        clay: '#B4491F',
        charcoal: '#211F1E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        zebra: "url('/patterns/zebra.jpg')",
        giraffe: "url('/patterns/giraffe.jpg')",
        tribal: "url('/patterns/tribal-full.jpg')",
        hero: "url('/patterns/hero-pattern.png')",
      },
    },
  },
  plugins: [],
}
