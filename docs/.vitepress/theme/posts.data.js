// posts.data.js
import { createContentLoader } from 'vitepress';

export default createContentLoader('/code_pages/posts/**.md', {
  transform: (raw) => {
    return raw
      .map(({ url, frontmatter, subtext }) => ({
        title: frontmatter.title,
        url,
        subtext: frontmatter.subtext,
        keywords: frontmatter.keywords,
        date: frontmatter.date,
        thumbnail: frontmatter.thumbnail,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
});
