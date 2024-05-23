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
  <div class="max-w-screen-lg mx-auto">
    <div class="h-52 flex items-center mx-2">
      <div class="text-left">
        <div class="font-bold text-4xl">Publications</div>
      </div>
    </div>
    <div
      class="flex flex-row mb-4 text-sm md:text-md tracking-wider uppercase opacity-70 ">
      <a class="inline-flex flex-1 justify-center hover:text-sky-500" href="#section-1">Preprints</a>
      <a class="inline-flex flex-1 justify-center hover:text-sky-500" href="#section-2">First author </a>
      <a class="inline-flex flex-1 justify-center hover:text-sky-500" href="#section-3">Co-authored</a>
    </div>
    <div class="pb-10 mx-2">
      <div class="h-1 bg-black/70 dark:bg-white/30"></div>
      <h2 class=" text-2xl leading-8 font-semibold py-10 ">Preprints</h2>
      <div id="section-1" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-8 px-8">
        <div v-for="paper in preprints" :key="paper.title" class="card">
          <a :href="paper.link" class="block h-full">
            <div
              class="h-full flex flex-col justify-evenly space-y-2 p-6 bg-white dark:bg-white/10 rounded-lg shadow-md border-2">
              <div class="space-y-4">
                <div class="text-xl leading-8 font-semibold tracking-tight">{{ paper.title }}</div>
                <div class="flex justify-center">
                  <img :src="paper.image" class="object-contain aspect-square max-h-36 w-full">
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
      <div class="h-1 bg-black/70 dark:bg-white/30"></div>
      <h2 class="text-2xl leading-8 font-semibold py-10 px-8">First author publications</h2>
      <div id="section-2" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        <div v-for="paper in publications" :key="paper.title" class="card">
          <a :href="paper.link" class="block h-full">
            <div
              class="h-full flex flex-col justify-between space-y-2 p-6 bg-white dark:bg-white/10 rounded-lg shadow-md border-2">
              <div class="space-y-4">
                <div class="text-xl leading-8 font-semibold">{{ paper.title }}</div>
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
      <div class="h-1 bg-black/70 dark:bg-white/30"></div>
      <h2 class="text-2xl leading-8 tracking-tight font-semibold py-10 px-8">Co-authored Publications</h2>
      <div id="section-3" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        <div v-for="paper in coauthor" :key="paper.title" class="card">
          <a :href="paper.link" class="block h-full">
            <div
              class="h-full flex flex-col justify-between space-y-2 p-6 bg-white dark:bg-white/10 rounded-lg shadow-md border-2">
              <div class="space-y-4">
                <div class="text-xl leading-8 font-semibold tracking-tight">{{ paper.title }}</div>
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