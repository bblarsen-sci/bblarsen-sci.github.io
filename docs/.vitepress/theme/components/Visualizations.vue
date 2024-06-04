<template>
    <div class="dark:prose-dark prose mx-auto max-w-screen-xl px-4 lg:px-6">
        <h1 class="py-16">Visualizing Biological Data</h1>
        <h2>Overview</h2>
        <p>
            This section hosts different visualizations, primarily of deep mutational scanning data from
            the <a href="https://dms-vep.github.io/Nipah_Malaysia_RBP_DMS/">Nipah virus RBP project</a>.
            Deep mutational scanning is a technique that allows us to measure the effects of all possible
            mutations on protein function. Visualizing this volume of data is challenging. I initially
            created this website because I wanted to learn how to make figures with
            <a href="https://d3js.org/">D3</a>, a JavaScript library for data visualization. As I worked
            through examples and tutorials, I created some basic and experimental figures.
        </p>
        <p>
            My interest in D3 led me to explore <a href="https://vitepress.dev">Vitepress</a>, a static
            site generator, and <a href="https://vuejs.org">Vue</a>, a front-end JavaScript framework for
            interacting with the Document Object Model (DOM). The DOM represents the structure of a web
            page, and both Vue and D3 can manipulate it. With Vitepress, it is possible to make Vue single
            file components directly in the markdown file, allowing you to mix markdown, HTML, JavaScript,
            and CSS all in the same file. I am using <a href="https://tailwindcss.com">Tailwind CSS</a> to
            style the components and applying
            <a href="https://github.com/tailwindlabs/tailwindcss-typography">Prose typography</a> to
            certain text elements.
        </p>
        <p>
            In addition to the D3 and Vue visualizations, there are also a few posts that explain how to
            create more intermediate/advanced visualizations using the Python package
            <a href="https://altair-viz.github.io/">Altair</a>, or how to map deep mutational scanning
            data onto protein structures using <a href="https://www.cgl.ucsf.edu/chimerax/">ChimeraX</a>.
        </p>
        <h2 class="py-12">Posts</h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="(post, index) in posts" :key="index"
                class="flex flex-col overflow-hidden rounded-lg border border-slate-200 shadow hover:border-slate-400 dark:border-slate-700">
                <a :href="post.url" class="flex flex-col h-full">
                    <div class="relative">
                        <img v-if="post.thumbnail" :src="post.thumbnail" class="w-full h-24 object-cover rounded-t-lg" />
                        
                    </div>
                    <div class="p-4 flex-grow">
                        <strong class="text-xl font-semibold mb-2">
                            {{ post.title }}
                        </strong>
                        <p v-if="post.subtext" class="text-slate-600 dark:text-slate-400 mb-4" v-html="post.subtext">
                        </p>
                        <div class="mt-auto">
                            <p class="text-sm text-slate-500 dark:text-slate-400">
                                Software: <span v-for="(keyword, kIndex) in post.keywords" :key="kIndex">{{ keyword
                                    }}</span>
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { data as posts } from '../posts.data.js';
import { useData } from 'vitepress';

export default {
  data() {
    return {
      posts: posts
        .filter((post) => post.url.endsWith('.html'))
        .map((post) => ({
          ...post,
        })),
      frontmatter: useData().frontmatter,
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
