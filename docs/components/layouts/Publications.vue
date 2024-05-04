---
layout: page
---

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
    fetch('/papers/papersFirst.json')
      .then(response => response.json())
      .then(data => {
        this.publications = data;
      });
    fetch('/papers/papersSecond.json')
      .then(response => response.json())
      .then(data => {
        this.coauthor = data;
      });
    fetch('/papers/preprints.json')
      .then(response => response.json())
      .then(data => {
        this.preprints = data;
      });
  },
};
</script>


<template>
  <div class="text-slate-800 dark:text-slate-400 bg-white dark:bg-slate-900">
    <div class="flex flex-col justify-center h-80 md:h-96 bg-layeredpeaks">
      <div class="text-left text-4xl 2xl:text-6xl tracking-tight leading-8 font-bold px-8">
        <p>Publications</p>
      </div>
    </div>
    <div class="pb-10">
      <div class="h-1 bg-slate-400"></div>
      <h2 class="text-2xl 2xl:text-4xl leading-8 tracking-tight font-bold py-10 px-8">Preprints</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        <div v-for="paper in preprints" :key="paper.title" class="card">
          <a :href="paper.link" class="block h-full">
            <div class="h-full flex flex-col justify-between space-y-2 p-6 bg-white dark:bg-slate-700 rounded-xl shadow-md shadow-slate-500">
              <div class="space-y-4">
                <div class="text-2xl leading-8 font-semibold tracking-tight">{{ paper.title }}</div>
                <div class="flex justify-center">
                  <img :src="paper.image" class="object-contain h-56 w-full">
                </div>
                <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
                <p class="line-clamp-3 keywords">{{ paper.abstract }}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="pb-10">
      <div class="h-1 bg-slate-400"></div>
      <h2 class="text-2xl 2xl:text-4xl leading-8 tracking-tight font-bold py-10 px-8">First author publications</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        <div v-for="paper in publications" :key="paper.title" class="card">
          <a :href="paper.link" class="block h-full">
            <div class="h-full flex flex-col justify-between space-y-2 p-6 bg-white dark:bg-slate-700 rounded-xl shadow-md shadow-slate-500">
              <div class="space-y-4">
                <div class="text-2xl leading-8 font-semibold tracking-tight">{{ paper.title }}</div>
                <div class="flex justify-center">
                  <img :src="paper.image" class="object-contain h-56 w-full">
                </div>
                <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
                <p class="line-clamp-3 keywords">{{ paper.abstract }}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="pb-10">
      <div class="h-1 bg-slate-400"></div>
      <h2 class="text-2xl 2xl:text-4xl leading-8 tracking-tight font-bold py-10 px-8">Co-authored Publications</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        <div v-for="paper in coauthor" :key="paper.title" class="card">
          <a :href="paper.link" class="block h-full">
            <div class="h-full flex flex-col justify-between space-y-2 p-6 bg-white dark:bg-slate-700 rounded-xl shadow-md shadow-slate-500">
              <div class="space-y-4">
                <div class="text-2xl leading-8 font-semibold tracking-tight">{{ paper.title }}</div>
                <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
                <p class="line-clamp-3 keywords">{{ paper.abstract }}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

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