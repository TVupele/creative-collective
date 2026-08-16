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
        saffron: '#E8862E',
        cocoa: '#8B5A2E',

        // Shop surfaces — softer neutrals that sit between parchment and white
        bone: '#FFFCF6',
        sand: '#F3E9D9',
        dune: '#E7DAC6',
        // Supporting status colours, warm enough to live beside amber/clay
        sage: '#3F7A5E',
        plum: '#6B3F63',

        // Shop collective palette, sampled from the collection artwork
        night: '#252040',     // sampled from the ring artwork background
        nightDeep: '#1D1934',
        flame: '#F4762B',     // headline orange
        sun: '#FAED00',       // feature-list yellow
        cream: '#FFF8AF',     // collection card title text
        leaf: '#00A55A',      // collective mark green
        rose: '#EE3D6E',      // ring pink
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        '4xl': '1.75rem',
        '5xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18,20,26,0.04), 0 10px 26px -14px rgba(18,20,26,0.22)',
        lift: '0 2px 4px rgba(18,20,26,0.04), 0 26px 48px -22px rgba(18,20,26,0.38)',
        glow: '0 18px 40px -20px rgba(232,162,58,0.65)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
      backgroundImage: {
        zebra: "url('/patterns/zebra.jpg')",
        giraffe: "url('/patterns/giraffe.jpg')",
        tribal: "url('/patterns/tribal-full.jpg')",
        hero: "url('/patterns/hero-pattern.png')",
        collective: "url('/patterns/collective-bg.png')",
        festac: "url('/patterns/festac-bg.jpg')",
      },
    },
  },
  plugins: [],
}
