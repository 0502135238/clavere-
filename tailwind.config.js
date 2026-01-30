/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CLAVERE purple theme
        purple: {
          400: '#a855f7',
          500: '#9333ea',
          600: '#7e22ce',
          700: '#6b21a8',
        },
        // Dark theme colors
        dark: {
          bg: '#0a0a0a',
          surface: '#111111',
          border: '#1f1f1f',
          text: '#ffffff',
          muted: '#666666',
        },
        // Colorblind-friendly speaker colors
        speaker: {
          1: '#3b82f6', // Blue
          2: '#10b981', // Green
          3: '#f59e0b', // Amber
          4: '#8b5cf6', // Purple
        },
      },
      fontSize: {
        'caption-sm': ['1.5rem', { lineHeight: '1.8' }],
        'caption-md': ['2rem', { lineHeight: '1.8' }],
        'caption-lg': ['2.5rem', { lineHeight: '1.8' }],
      },
    },
  },
  plugins: [],
}
