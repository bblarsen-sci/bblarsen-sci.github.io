import { defineConfig } from 'vitepress';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';

export default defineConfig({
  lang: 'en-US',
  title: 'Brendan Larsen',
  description: "Brendan Larsen's Personal Website",
  markdown: {
    theme: 'aurora-x',
    codeTransformers: [
      transformerTwoslash()
    ]
}});
