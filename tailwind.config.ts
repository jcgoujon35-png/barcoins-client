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
        navy:          '#0D1B2E',
        'navy-card':   '#1A2942',
        'navy-card-2': '#162035',
        violet:        '#2D1248',
        'gold-warm':   '#C9922A',
        'gold-light':  '#F2C96B',
        gold:          '#C9922A',
        cream:         '#F5F0E8',
        amber:         '#E8860A',
        'live-green':  '#22C55E',
        danger:        '#EF4444',
        bronze:        '#CD7F32',
        silver:        '#C0C0C0',
      },
    },
  },
  plugins: [],
}
export default config
