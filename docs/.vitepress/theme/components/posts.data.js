// posts.data.js
import { createContentLoader } from 'vitepress';

export default createContentLoader('visualizations/posts/*.md', {
  transform: (raw) => {
    return raw
      .map(({ url, frontmatter, subtext }) => ({
        title: frontmatter.title,
        subtext: frontmatter.subtext,
        keywords: frontmatter.keywords,
        date: frontmatter.date,
        thumbnail: frontmatter.thumbnail,
        url,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
});
