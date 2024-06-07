// posts.data.js
import { createContentLoader } from 'vitepress';

/**
 * Creates a content loader for posts.
 *
 * @param {string} pattern - The pattern for matching post files.
 * @param {Object} options - The options for transforming the raw data.
 * @param {Function} options.transform - The transformation function for processing the raw data.
 * @returns {Array} - The sorted array of transformed post data.
 */
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
