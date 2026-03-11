/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',        // Indigo-600
        brand: '#4338CA',          // Indigo-700
        accent: '#C026D3',         // Fuchsia-600
        success: '#10B981',        // Emerald-500
        warning: '#F59E0B',        // Amber-500
        'indigo-600': '#4F46E5',
        'indigo-700': '#4338CA',
        'indigo-50': '#EEF2FF',
        'fuchsia-600': '#C026D3',
        'fuchsia-700': '#A21CAF',
        'emerald-500': '#10B981',
        'emerald-50': '#ECFDF5',
        'amber-500': '#F59E0B',
        'amber-50': '#FFFBEB',
        'gray-50': '#F9FAFB',
        'gray-200': '#E5E7EB',
        'gray-600': '#4B5563',
        'gray-900': '#111827',
      },
    },
  },
  plugins: [],
}
