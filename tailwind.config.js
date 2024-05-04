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
        'sky-light': 'linear-gradient(150deg, #1E293B, #0C4A6E)',
        'sky-dark': 'linear-gradient(220deg, #0C4A6E, #1E293B)',
        'hero': 'linear-gradient(180deg, hsla(0, 0%, 100%, 1) 50%, hsla(202, 80%, 24%, 1) 100%)',
        'layeredpeaks': "url('/images/backgrounds/layered-peaks.svg')",
        'lightbluewaves': "url('/images/backgrounds/light-blue-waves.svg')",
        'nipah': "url('/images/nipah.png')",
        'lightblue' : 'linear-gradient(15deg, #075985, #1d5881, #29587d, #325779, #395675, #3e5671, #43556d, #475569)',


      },
      fontFamily: {
        "roboto": "Roboto, sans-serif",
      }
    },
  },
  plugins: [],
}

