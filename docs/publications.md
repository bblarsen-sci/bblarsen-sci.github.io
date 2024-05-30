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


<div class="mx-auto prose prose-a:no-underline prose-slate dark:prose-invert max-w-screen-lg px-2">
  <h1 class="py-10 ">Publications</h1>
  <div class="flex flex-row mb-4 text-sm md:text-md tracking-wider uppercase">
    <a class="inline-flex flex-1 justify-center" href="#section-1">Preprints</a>
    <a class="inline-flex flex-1 justify-center" href="#section-2">First author </a>
    <a class="inline-flex flex-1 justify-center" href="#section-3">Co-authored</a>
  </div>
  <div class="h-1 bg-black dark:bg-white"></div>
  <h2 class="py-8">Preprints</h2>
  <div id="section-1" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-4 px-10 md:px-6">
    <div v-for="paper in preprints" :key="paper.title" class="card">
      <a :href="paper.link" class="block h-full">
        <div class="h-full flex flex-col justify-center px-4 rounded-lg shadow-md border-2 dark:bg-[#202127]">
          <h4 class="">{{ paper.title }}</h4>
          <img :src="paper.image" class="object-contain aspect-square h-36 ">
          <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
          <p class="prose prose-sm dark:prose-invert line-clamp-3">{{ paper.abstract }}</p>
        </div>
      </a>
    </div>
  </div>
  <div class="mt-8 h-1 bg-black dark:bg-white"></div>
  <h2 class="py-8">First author publications</h2>
  <div id="section-2" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-4 px-10 md:px-6">
    <div v-for="paper in publications" :key="paper.title" class="card">
      <a :href="paper.link" class="block h-full">
        <div class="h-full flex flex-col justify-center px-4 rounded-lg shadow-md border-2">
          <h4>{{ paper.title }}</h4>
          <img :src="paper.image" class="object-contain aspect-square h-36">
          <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
          <p class="prose prose-sm dark:prose-invert line-clamp-3">{{ paper.abstract }}</p>
        </div>
      </a>
    </div>
  </div>
  <div class="mt-8 h-1 bg-black dark:bg-white"></div>
  <h2 class="py-8">Co-authored Publications</h2>
  <div id="section-3" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-4 px-10 md:px-6">
    <div v-for="paper in coauthor" :key="paper.title" class="card">
      <a :href="paper.link" class="block h-full">
        <div class="h-full flex flex-col justify-center px-4 rounded-lg shadow-md border-2">
          <h4>{{ paper.title }}</h4>
          <div class="text-center">{{ paper.journal }}, {{ paper.year }}</div>
          <p class="prose prose-sm dark:prose-invert line-clamp-3">{{ paper.abstract }}</p>
        </div>
      </a>
    </div>
  </div>
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