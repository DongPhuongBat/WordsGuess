/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 3s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
      },
    },

  theme: {
    extend: {},
  },
  plugins: [],
}