<template>
    <div class="px-6 pb-6 mx-auto max-w-screen-lg">
        <div class="flex flex-col items-center justify-between py-4">
            <p class="text-3xl tracking-tight leading-8 font-bold ">Visualizing
                Biological Data</p>
            <p class="py-4 text-lg">With <a href="https://d3js.org/" class="text-sky-500 hover:text-sky-600">D3</a>, <a
                    href="https://altair-viz.github.io/" class="text-sky-500 hover:text-sky-600">Altair</a>, and <a
                    href="https://www.cgl.ucsf.edu/chimerax/" class="text-sky-500 hover:text-sky-600">ChimeraX</a></p>
        </div>
        <div>
            <v-select
                class="mb-10 max-w-96 border-2 rounded-md shadow-sm text-base"
                v-model="selectedKeywords" :options="filteredKeywords" multiple placeholder="Filter by keywords">
            </v-select>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="(post, index) in filteredPosts" :key="index" class="card">
                    <a :href="post.url" class="block h-full">
                        <article
                            class="h-full flex flex-col justify-between space-y-2 p-6 dark:bg-white/10 rounded-lg shadow-md border-2">
                            <div class="space-y-4">
                                <p
                                    class="text-2xl leading-8 font-semibold ">
                                    {{ post.title }}</p>
                                <div v-if="post.subtext" class=""
                                    v-html="post.subtext"></div>
                                <div v-if="post.keywords" class="keywords">
                                    <span><strong>Keywords: </strong></span>
                                    <span v-for="(keyword, kIndex) in post.keywords" :key="kIndex">{{ keyword }}<span
                                            v-if="kIndex < post.keywords.length - 1">, </span></span>
                                </div>
                            </div>
                            <div class="mt-4 text-sky-600">
                            </div>
                        </article>
                    </a>
                </div>
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
            required: true
        }
    },
    setup(props) {
        const { frontmatter } = useData();
        const selectedKeywords = ref([]);

        const filteredPosts = computed(() => {
            const currentDirectory = props.currentDirectory;

            return postsData.filter(post => {
                const parentDirectory = post.url.split('/').slice(-3, -2)[0];
                const isInCurrentDirectory = parentDirectory === currentDirectory;
                const hasSelectedKeywords = selectedKeywords.value.length === 0 ||
                    post.keywords?.some(keyword => selectedKeywords.value.includes(keyword));

                return isInCurrentDirectory && hasSelectedKeywords;
            });
        });

        const filteredKeywords = computed(() => {
            const keywords = new Set();
            filteredPosts.value.forEach(post => {
                if (post.keywords) {
                    post.keywords.forEach(keyword => keywords.add(keyword));
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
    }
}
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