/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Design system tokens (Req 23) ──
        primary:   '#10B981',  // emerald-500
        secondary: '#0F172A',  // slate-900
        accent:    '#FFD700',  // gold (kept)
        // ── Status colors ──
        success:   '#10B981',  // emerald-500
        warning:   '#F59E0B',  // amber-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
