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
        const collapsed = ref(true);

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

        const toggleVisibility = () => {
            // Toggle the value of the 'collapsed' variable when the button is clicked
            collapsed.value = !collapsed.value;
        };

        return {
            frontmatter,
            selectedKeywords,
            filteredKeywords,
            filteredPosts,
            currentDirectory: props.currentDirectory,
            collapsed,
            toggleVisibility
        };
    }
}
</script>


<template>
    <div>
        <h2 class="title-section">See all posts about code</h2>
        <p>See below to explore all my posts about using code to analyze data, in particular protein and deep mutational scanning data. You can use the select box to filter the
            experiments by
            keyword.</p>
        <v-select class="p-6 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm text-gray-700 dark:text-slate-300 text-base"
        v-model="selectedKeywords"
        :options="filteredKeywords"
        multiple
        placeholder="Filter by keywords"></v-select>
        <ul class="divide-y divide-gray-200 dark:divide-slate-200/5">
            <li class="py-8" v-for="(post, index) in filteredPosts" :key="index">
                <article class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                    <DateComponent :dateString="post.date" />
                    <div class="space-y-5 xl:col-span-3">
                        <div class="space-y-6">
                            <h2 class="text-2xl leading-8 font-bold tracking-tight">
                                <a :href="post.url">{{
                                    post.title
                                }}</a>
                            </h2>
                            <div v-if="post.subtext" class="" v-html="post.subtext">
                            </div>
                            <div v-if="post.keywords" class="keywords">
                                <span><strong>Keywords: </strong></span>
                                <span v-for="(keyword, kIndex) in post.keywords" :key="kIndex">{{ keyword }}<span
                                        v-if="kIndex < post.keywords.length - 1">, </span></span>
                            </div>
                        </div>
                        <div class="text-base leading-6 font-medium">
                            <a class="link" aria-label="read more" :href="post.url">Read more →</a>
                        </div>
                    </div>
                </article>
            </li>
        </ul>
    </div>
</template>

<style scoped>
a {
    text-decoration: none;
}

.prose a {
    color: var(--vp-c-text-2);
}

.date {
    color: var(--vp-c-text-2);
}

li {
    list-style-type: none;
}

.description {
    color: var(--vp-c-text-1);
}

article h2 {
    margin: 0;
    border-top: none;
    padding-top: 0;
}

article h2 a {
    margin: 0;
    border-top: none;
    padding-top: 0;
    color: var(--vp-c-text-1);
}

.keywords {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
}

:deep(.vs__dropdown-menu) {
    background-color: var(--vp-c-bg);
}
</style>