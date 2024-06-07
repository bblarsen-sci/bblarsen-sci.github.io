//const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{vue,js,html,md}',
    './docs/components/**/*.vue',
    './docs/visualizations/*.md',
    './docs/visualizations/posts/*.md',
    './docs/**.md',
  ],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      }),
      backgroundImage: {
        'sky-dark': 'linear-gradient(220deg, #0C4A6E, #1E293B)', //sky-900 to slate-800
        'red': 'linear-gradient(120deg, #1e293b, #450a0a)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
