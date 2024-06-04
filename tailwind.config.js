//const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{vue,js,html,md}',
    './docs/components/**/*.vue',
    './docs/code_pages/*.md',
    './docs/code_pages/posts/*.md',
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
        'sky-light': 'linear-gradient(150deg, #1E293B, #0C4A6E)', //slate-800 to sky-900
        'sky-dark': 'linear-gradient(220deg, #0C4A6E, #1E293B)', //sky-900 to slate-800
        nipah: "url('/images/nipah.png')",
        red: 'linear-gradient(220deg, #1e293b, #450a0a)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
