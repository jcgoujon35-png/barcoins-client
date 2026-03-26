import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1a1a2e',
        'navy-dark': '#0d0d1a',
        gold: '#F59E0B',
        'gold-light': '#FCD34D',
        'gold-dark': '#D97706',
      },
    },
  },
  plugins: [],
}
export default config
