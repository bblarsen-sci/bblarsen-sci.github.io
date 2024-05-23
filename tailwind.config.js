const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{vue,js,vue,html,md}',
    './docs/components/**/*.vue',
    './docs/**.md',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      backgroundImage: {
        'sky-light': 'linear-gradient(150deg, #1E293B, #0C4A6E)', //slate-800 to sky-900
        'sky-dark': 'linear-gradient(220deg, #0C4A6E, #1E293B)', //sky-900 to slate-800
        'nipah': "url('/images/nipah.png')",
        'red' : 'linear-gradient(220deg, #1e293b, #450a0a)',
      },
      fontFamily: {
        sans: ['Open sans','Inter var', ...defaultTheme.fontFamily.sans],
      },
      'cerulean-blue': {
        '50': '#f1f3fd',
        '100': '#dfe5fa',
        '200': '#c6d1f7',
        '300': '#a0b4f0',
        '400': '#728ce8',
        '500': '#5167e0',
        '600': '#3e4bd4',
        '700': '#3339c2',
        '800': '#2f309e',
        '900': '#2b2d7d',
        '950': '#1e1e4d',
    },
    
    },
  },
  plugins: [
    
  ],
}

