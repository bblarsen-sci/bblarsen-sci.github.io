<script setup>
import { computed, ref } from 'vue';
import { data as posts } from './posts.data.js';
import { useData, useRoute } from 'vitepress';

const route = useRoute();
const frontmatter = useData().frontmatter;
const isSidebarOpen = ref(false);

const filteredPosts = computed(() => {
  return posts
    .filter((post) => post.url.endsWith('.html'))
    .map((post) => ({
      ...post,
    }));
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<template>
  <div class="h-full w-full px-2 py-4 md:px-16 lg:px-32 2xl:px-80">
    <div class="flex flex-col md:flex-row">
      <main class="mx-auto w-full px-2 md:w-5/6">
        <Content />
      </main>
      <button
        @click="toggleSidebar"
        class="fixed right-1 top-16 rounded-full p-2 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill-rule="evenodd"
          viewBox="0 0 16 16"
          stroke="currentColor"
          stroke-width="0.5"
        >
          <path
            d="M3.646 10.146a.5.5 0 0 1 .708 0L8 13.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708m0-4.292a.5.5 0 0 0 .708 0L8 2.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8"
          />
        </svg>
      </button>
      <aside v-if="isSidebarOpen" class="fixed right-0 top-24 z-40 h-1/2 w-32 border md:block">
        <div class="h-full overflow-y-auto bg-slate-200 p-2 dark:bg-slate-800">
          <strong class="mb-4">Other posts</strong>
          <ul class="space-y-2 text-xs">
            <li v-for="(post, index) in filteredPosts" :key="index">
              <a
                :href="post.url"
                :class="{
                  'text-red-500': route.path === post.url,
                  '': route.path !== post.url,
                }"
                class="flex items-center border-none p-0"
              >
                {{ post.title }}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>
