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
        'sky-light': 'linear-gradient(300deg, #076585, #fff)',
        'sky-dark': 'linear-gradient(300deg, #000C40, #607D8B)',
        'pastel': "url('/images/pastel.svg')",
        'virus': "url('/images/Virus.svg')",
        'waves': "url('/images/layered-peaks.svg')"

      },
      fontFamily: {
        "roboto": "Roboto, sans-serif",
      }
    },
  },
  plugins: [],
}

