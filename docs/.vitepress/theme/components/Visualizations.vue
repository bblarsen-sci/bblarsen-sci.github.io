<template>
    <div class="mx-auto prose dark:prose-dark dark:prose-invert justify-between ">
        <h1 class="">Visualizing Biological Data</h1>
        <img src="/images/nipah.jpg" class="max-w-60 rounded-lg shadow-md mx-auto">
        <h2>Overview</h2>
        <p>This section hosts different visualizations, primarily of deep mutational scanning data from the <a
                href="https://dms-vep.github.io/Nipah_Malaysia_RBP_DMS/">Nipah virus RBP project</a>. Deep mutational
            scanning is a technique that allows us to measure the effects of all possible mutations on protein function.
            Visualizing this volume of data is challenging. I initially created this website because I wanted to learn
            how to make figures with <a href="https://d3js.org/">D3</a>, a JavaScript library for data visualization. As
            I worked through examples and tutorials, I created some basic and experimental figures. </p>
        <p>My interest in D3 led me to explore <a href="https://vitepress.dev">Vitepress</a>, a static site generator,
            and <a href="https://vuejs.org">Vue</a>, a front-end JavaScript framework for interacting with the Document
            Object Model (DOM). The DOM represents the structure of a web page, and both Vue and D3 can manipulate it.
            With Vitepress, it is possible to make Vue single file components directly in the markdown file, allowing
            you to mix markdown, HTML, JavaScript, and CSS all in the same file. I am using <a
                href="https://tailwindcss.com">Tailwind CSS</a> to style the components and applying <a
                href="https://github.com/tailwindlabs/tailwindcss-typography">Prose typography</a> to certain text
            elements.</p>
        <p>In addition to the D3 and Vue visualizations, there are also a few posts that explain how to create more
            intermediate/advanced visualizations using the Python package <a
                href="https://altair-viz.github.io/">Altair</a>, or how to map deep mutational scanning data onto
            protein structures using <a href="https://www.cgl.ucsf.edu/chimerax/">ChimeraX</a>.</p>
        <div class="mb-16"></div>
        <h2 class="mb-16">Posts</h2>
    </div>
    <div class="container mx-auto">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
            <div v-for="(post, index) in posts" :key="index"
                class="card container block max-w-sm rounded-lg border border-slate-200 shadow hover:border-slate-400 dark:border-slate-700">
                <a :href="post.url" class="flex h-full flex-col">
                    <div class="h-36" v-if="post.thumbnail">
                        <img :src="post.thumbnail" class="h-full w-full rounded-t-lg object-cover" />
                    </div>
                    <div class="flex flex-grow flex-col justify-between p-5">
                        <div>
                            <h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {{ post.title }}
                            </h2>
                            <p v-if="post.subtext" class="keywords mb-2 text-sm" v-html="post.subtext"></p>
                        </div>
                        <div v-if="post.keywords" class="keywords mt-4">
                            <span><strong class="font-bold text-slate-900 dark:text-white">Software: </strong></span>
                            <span v-for="(keyword, kIndex) in post.keywords" :key="kIndex">
                                {{ keyword }}<span v-if="kIndex < post.keywords.length - 1">, </span>
                            </span>
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
                .filter(post => post.url.endsWith('.html'))
                .map(post => ({
                    ...post,
                })),
            frontmatter: useData().frontmatter
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