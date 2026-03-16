/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── New design system tokens (Req 13) ──
        primary:   '#FF4D00',  // orange-red  (replaces Indigo-600 everywhere)
        secondary: '#1A1A2E',  // deep navy
        accent:    '#FFD700',  // gold
        brand:     '#CC3D00',  // primary hover (darker orange-red)
        // ── Status colors ──
        success:   '#10B981',  // Emerald-500
        warning:   '#F59E0B',  // Amber-500
        // ── Neutral palette ──
        'gray-50':  '#F9FAFB',
        'gray-200': '#E5E7EB',
        'gray-600': '#4B5563',
        'gray-900': '#111827',
      },
      fontFamily: {
        heading: ['Sora', 'system-ui', 'sans-serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
