module.exports = {
  content: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'title': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'body': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        'apple': {
          'blue': '#2997ff',
          'black': '#000000',
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}