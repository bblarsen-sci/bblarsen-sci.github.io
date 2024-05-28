import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: "Brendan Larsen",
  description: "Brendan Larsen's Personal Website",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [

      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Publications', link: '/publications' },
      { text: 'Visualizations', link: '/code_pages/code_index' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bblarsen-sci' },
      { icon: 'twitter', link: 'https://twitter.com/bblarsen1' }
    ],
  },
  vite: {
    ssr: {
      noExternal: ["vue-select"],
    },
  },
});

