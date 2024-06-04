<script>
export default {
    data() {
        return {
            publications: [],
            coauthor: [],
            preprints: []
        };
    },
    mounted() {
        console.log('mounted')
        fetch('../papersFirst.json')
            .then(response => response.json())
            .then(data => {
                this.publications = data;
            });
        fetch('../papersSecond.json')
            .then(response => response.json())
            .then(data => {
                this.coauthor = data;
            });
        fetch('../preprints.json')
            .then(response => response.json())
            .then(data => {
                this.preprints = data;
            });
    },
};
</script>

<template>
    <div class="prose dark:prose-dark dark:prose-invert">
        <h1 class="pb-16">Publications</h1>
        <div class="flex flex-row pb-4 text-sm md:text-md tracking-wider uppercase">
            <a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-400"
                href="#section-1">Preprints</a>
            <a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-400"
                href="#section-2">First author </a>
            <a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-400"
                href="#section-3">Co-authored</a>
        </div>
    </div>
    <div class="prose dark:prose-dark dark:prose-invert">
        <div class="h-1 bg-black dark:bg-white"></div>
        <h2 class="py-8 text-2xl font-semibold tracking-tight">Preprints</h2>
        <div id="section-1" class="not-prose grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="paper in preprints" :key="paper.title"
                class="card block h-full max-w-sm rounded-lg border border-slate-200 shadow  dark:border-slate-700 hover:border-slate-400">
                <a :href="paper.link">
                    <div class="p-5">
                        <h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{{ paper.title
                            }}</h2>
                        <img :src="paper.image" class="mx-auto object-contain aspect-square max-h-36 ">
                        <div class="text-center text-sm my-2">{{ paper.journal }}, {{ paper.year }}</div>
                        <p class="font-light text-xs line-clamp-3">{{ paper.abstract }}</p>
                    </div>
                </a>
            </div>
        </div>
        <div class="mt-8 h-1 bg-black dark:bg-white"></div>
        <h2 class="py-8 text-2xl font-semibold tracking-tight">First author publications</h2>
        <div id="section-2" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 not-prose">
            <div v-for="paper in publications" :key="paper.title"
                class="card block h-full max-w-sm rounded-lg border border-slate-200 shadow  dark:border-slate-700 hover:border-slate-400">
                <a :href="paper.link">
                    <div class="p-5">
                        <h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{{ paper.title
                            }}</h2>
                        <img :src="paper.image" class="mx-auto object-contain aspect-square max-h-36 ">
                        <div class="text-center text-sm my-2">{{ paper.journal }}, {{ paper.year }}</div>
                        <p class="font-light text-xs line-clamp-3">{{ paper.abstract }}</p>
                    </div>
                </a>
            </div>
        </div>
        <div class="mt-8 h-1 bg-black dark:bg-white"></div>
        <h2 class="py-8 text-2xl font-semibold tracking-tight">Co-authored Publications</h2>
        <div id="section-3" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 not-prose">
            <div v-for="paper in coauthor" :key="paper.title"
                class="card block h-full max-w-sm rounded-lg border border-slate-200 shadow  dark:border-slate-700 hover:border-slate-400">
                <a :href="paper.link">
                    <div class="p-5">
                        <h2 class="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{{ paper.title
                            }}</h2>
                        <div class="text-center text-sm my-2">{{ paper.journal }}, {{ paper.year }}</div>
                        <p class="font-light text-xs line-clamp-3">{{ paper.abstract }}</p>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
a {
    text-decoration: none;
    border: none;
}

.card {
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}
</style>
