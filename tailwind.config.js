/** @type {import('tailwindcss').Config} */
// Brand colours come from CSS variables (see src/index.css) so the whole app can switch theme at runtime.
const v = (n) => `rgb(var(--brand-${n}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { 50: v(50), 100: v(100), 200: v(200), 300: v(300), 400: v(400), 500: v(500), 600: v(600), 700: v(700), 800: v(800), 900: v(900) },
        aurora: 'rgb(var(--aurora) / <alpha-value>)',
        ink: { DEFAULT: '#0f172a', soft: '#475569', muted: '#94a3b8' },
        surface: { DEFAULT: '#ffffff', alt: '#f5f6fb', border: '#e5e7f0' },
      },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.04), 0 6px 20px -8px rgba(15,23,42,.10)',
        lift: '0 4px 8px rgba(15,23,42,.05), 0 18px 36px -14px rgb(var(--brand-600) / .35)',
        glow: '0 8px 24px -6px rgb(var(--brand-600) / .55)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'toast-in': { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(20px,-24px)' } },
      },
      animation: {
        'fade-in': 'fade-in .2s ease-out',
        'slide-up': 'slide-up .25s ease-out',
        'toast-in': 'toast-in .25s ease-out',
        float: 'float 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
