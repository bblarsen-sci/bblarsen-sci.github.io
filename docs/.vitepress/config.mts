import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Brendan Larsen",
  description: "Brendan Larsen's Personal Website",
  head: [
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-0M6M62QRZW' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-0M6M62QRZW');`
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [

      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Publications', link: '/publications' },
      {
        text: 'Code',
        items: [
          { text: 'Altair', link: '/python' },
          { text: 'D3', link: '/d3' },
          { text: 'Chimera', link: '/chimera' },

        ]
      }

    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/bblarsen-sci' },
      { icon: 'twitter', link: 'https://twitter.com/bblarsen1' }
    ],
  }
})
