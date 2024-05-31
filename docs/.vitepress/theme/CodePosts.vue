<template>
  <div class="container mx-auto max-w-screen-lg px-12">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(post, index) in filteredPosts"
        :key="index"
        class="card container block max-w-sm rounded-lg border border-slate-200 shadow dark:border-slate-700 hover:border-slate-400"
      >
        <a :href="post.url" class="flex flex-col h-full">
          <div class="h-48" v-if="post.thumbnail">
            <img :src="post.thumbnail" class="rounded-t-lg object-cover w-full h-full" />
          </div>
          <div class="p-5 flex-grow flex flex-col justify-between">
            <div>
              <h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{{ post.title }}</h2>
              <p v-if="post.subtext" class="keywords mb-2 text-sm" v-html="post.subtext"></p>
            </div>
            <div v-if="post.keywords" class="keywords mt-4">
              <span><strong class="font-bold text-slate-900 dark:text-white">Software: </strong></span>
              <span v-for="(keyword, kIndex) in post.keywords" :key="kIndex">{{ keyword }}<span v-if="kIndex < post.keywords.length - 1">, </span></span>
            </div>
          </div>
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
