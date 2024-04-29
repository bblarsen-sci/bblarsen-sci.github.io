<template>
    <div>
      <h2>Blog Posts</h2>
      <div>
        <label for="sort-select">Sort by:</label>
        <select id="sort-select" v-model="selectedSort">
          <option value="date">Date</option>
          <option value="topic">Topic</option>
        </select>
      </div>
      <ul>
        <li v-for="post in sortedPosts" :key="post.id">
          <router-link :to="post.path">{{ post.title }}</router-link>
          <span>{{ post.date }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        posts: [],
        selectedSort: 'date',
      };
    },
    computed: {
      sortedPosts() {
        if (this.selectedSort === 'date') {
          return this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (this.selectedSort === 'topic') {
          return this.posts.sort((a, b) => a.topic.localeCompare(b.topic));
        }
        return this.posts;
      },
    },
    created() {
      // Fetch the list of blog posts from your data source
      this.posts = [
        { id: 1, title: 'Post 1', date: '2023-06-01', topic: 'Topic A', path: '/blog/post-1' },
        { id: 2, title: 'Post 2', date: '2023-06-02', topic: 'Topic B', path: '/blog/post-2' },
        // Add more blog posts...
      ];
    },
  };
  </script>