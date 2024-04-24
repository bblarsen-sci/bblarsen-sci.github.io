/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{vue,js,vue,html,md}',
    './docs/components/**/*.vue',
    './docs/**.md',
  ],
  darkMode: 'selector',
  theme: {
    extend: {},
  },
  plugins: [],
}

