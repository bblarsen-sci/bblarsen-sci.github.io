<template>
  <div class="container mx-auto max-w-screen-lg px-2">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="(post, index) in filteredPosts" :key="index" class="card">
        <a :href="post.url" class="block h-full">
          <article
            class="dark:prose-dark prose flex h-full flex-col justify-between gap-2 rounded-lg border-2 border-slate-100 p-2 px-4 shadow-md hover:border-slate-300 dark:border-slate-500 dark:shadow-slate-500 dark:hover:border-slate-100"
          >
            <h2 class="">
              {{ post.title }}
            </h2>
            <div
              v-if="post.thumbnail"
              class="mx-auto aspect-square h-36 w-36 rounded-lg pb-6 shadow-lg"
            >
              <img :src="post.thumbnail" alt="Thumbnail" class="h-full w-full object-cover" />
            </div>
            <p v-if="post.subtext" class="keywords text-sm" v-html="post.subtext"></p>
            <p v-if="post.keywords" class="keywords">
              <span><strong>Software: </strong></span>
              <span v-for="(keyword, kIndex) in post.keywords" :key="kIndex"
                >{{ keyword }}<span v-if="kIndex < post.keywords.length - 1">, </span></span
              >
            </p>
          </article>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { data as postsData } from './posts.data.js';
import { useData } from 'vitepress';
import DateComponent from './Date.vue';

export default {
  components: {
    DateComponent,
  },
  props: {
    currentDirectory: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { frontmatter } = useData();
    const selectedKeywords = ref([]);

    const filteredPosts = computed(() => {
      const currentDirectory = props.currentDirectory;

      return postsData.filter((post) => {
        const parentDirectory = post.url.split('/').slice(-3, -2)[0];
        const isInCurrentDirectory = parentDirectory === currentDirectory;
        const hasSelectedKeywords =
          selectedKeywords.value.length === 0 ||
          post.keywords?.some((keyword) => selectedKeywords.value.includes(keyword));

        return isInCurrentDirectory && hasSelectedKeywords;
      });
    });

    const filteredKeywords = computed(() => {
      const keywords = new Set();
      filteredPosts.value.forEach((post) => {
        if (post.keywords) {
          post.keywords.forEach((keyword) => keywords.add(keyword));
        }
      });
      return Array.from(keywords);
    });

    return {
      frontmatter,
      selectedKeywords,
      filteredKeywords,
      filteredPosts,
      currentDirectory: props.currentDirectory,
    };
  },
};
</script>
<style scoped>
a {
  text-decoration: none;
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.keywords {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
