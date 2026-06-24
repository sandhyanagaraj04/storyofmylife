/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#070512',
        ink: '#f4f1ff',
        muted: '#a79fce',
        gold: '#fbbf24',
        green: '#34d399',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        control: '14px',
      },
    },
  },
  plugins: [],
}
