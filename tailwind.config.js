/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{vue,js,vue,html,md}',
    './docs/components/**/*.vue',
    './docs/**.md',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

//npx tailwindcss -i ./docs/.vitepress/theme/tailwind.postcss -o ./docs/.vitepress/theme/output.css --watch