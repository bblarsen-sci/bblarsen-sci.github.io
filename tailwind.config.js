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
        'wave': "url('/images/backgrounds/wave_background.svg')",
        'virus': "url('/images/backgrounds/virus.svg')",
        'layeredpeaks': "url('/images/backgrounds/layered-peaks.svg')",
        'blurrygradient': "url('/images/backgrounds/blurry-gradient-haikei.svg')",
        'simpleshiny': "linear-gradient(225deg, #94a3b8, #8395ad, #7288a2, #617b98, #506e8d, #3e6283, #295678, #0c4a6e)",
        'lightbluewaves': "url('/images/backgrounds/light-blue-waves.svg')",

      },
      fontFamily: {
        "roboto": "Roboto, sans-serif",
      }
    },
  },
  plugins: [],
}

