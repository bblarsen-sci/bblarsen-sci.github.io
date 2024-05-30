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

<div class="mx-auto prose dark:prose-dark dark:prose-invert max-w-screen-lg px-2">
  <h1 class="py-10">Publications</h1>
  <div class="flex flex-row mb-4 text-sm md:text-md tracking-wider uppercase ">
    <a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600" href="#section-1">Preprints</a>
    <a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600" href="#section-2">First author </a>
    <a class="inline-flex flex-1 justify-center dark:text-slate-300 text-slate-600 hover:text-red-600" href="#section-3">Co-authored</a>
  </div>
  <div class="h-1 bg-black dark:bg-white"></div>
  <h2 class="py-8 text-2xl">Preprints</h2>
  <div id="section-1" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-10 px-10 md:px-6">
    <div v-for="paper in preprints" :key="paper.title" class="card">
      <a :href="paper.link" class="block h-full">
        <div class="h-full flex flex-col justify-around px-4 rounded-lg shadow-md border-2 border-slate-100 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-100 dark:shadow-slate-500 gap-2 ">
          <h2 class="">{{ paper.title }}</h2>
          <img :src="paper.image" class="object-contain aspect-square h-36 ">
          <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
          <p class="prose prose-sm dark:prose-dark line-clamp-3">{{ paper.abstract }}</p>
        </div>
      </a>
    </div>
  </div>
  <div class="mt-8 h-1 bg-black dark:bg-white"></div>
  <h2 class="py-8 text-2xl">First author publications</h2>
  <div id="section-2" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-10 px-10 md:px-6">
    <div v-for="paper in publications" :key="paper.title" class="card">
      <a :href="paper.link" class="block h-full">
        <div class="h-full flex flex-col justify-around px-4 rounded-lg shadow-md border-2 border-slate-100 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-100 dark:shadow-slate-500 gap-2 ">
          <h2>{{ paper.title }}</h2>
          <img :src="paper.image" class="object-contain aspect-square h-36">
          <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
          <p class="prose prose-sm dark:prose-dark line-clamp-3">{{ paper.abstract }}</p>
        </div>
      </a>
    </div>
  </div>
  <div class="mt-8 h-1 bg-black dark:bg-white"></div>
  <h2 class="py-8 text-2xl">Co-authored Publications</h2>
  <div id="section-3" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-10 px-10 md:px-6">
    <div v-for="paper in coauthor" :key="paper.title" class="card">
      <a :href="paper.link" class="block h-full">
        <div class="h-full flex flex-col justify-around px-4 rounded-lg shadow-md border-2 border-slate-100 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-100 dark:shadow-slate-500 gap-2 ">
          <h2>{{ paper.title }}</h2>
          <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
          <p class="prose prose-sm dark:prose-dark line-clamp-3">{{ paper.abstract }}</p>
        </div>
      </a>
    </div>
  </div>
  <br></br>
</div>

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
