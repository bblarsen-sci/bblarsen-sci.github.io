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
  <html class="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-sans font-normal">
    <h2 id="section-3" class="container mx-auto text-2xl font-extrabold pb-16 pt-16">Preprints</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
      <div v-for="paper in preprints" :key="paper.title" class=" dark:bg-slate-700 relative shadow-lg shadow-slate-500 dark:shadow-sky-500/50 rounded-xl transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-500 hover:dark:shadow-sky-500 hover:-translate-y-2">
        <div class="text-center font-semibold mx-6 my-4">{{ paper.title }}</div>
        <img :src="paper.image" class="w-full h-36 px-8 object-cover rounded-lg" alt="paper image">
        <div class="text-center mx-6 my-4">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center mb-10 mx-6 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="text-xs absolute bottom-2 left-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-sky-500">Read more</a>
      </div>
    </div>
    <h2 id="section-1" class="container mx-auto text-2xl font-extrabold pb-16 pt-16">First author publications</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
      <div v-for="paper in publications" :key="paper.title" class=" dark:bg-slate-700 relative shadow-lg shadow-slate-500 dark:shadow-sky-500/50 rounded-xl transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-500 hover:dark:shadow-sky-500 hover:-translate-y-2">
        <div class="text-center font-semibold mx-6 my-4">{{ paper.title }}</div>
        <img :src="paper.image" class="object-bottom w-full max-h-32 px-6 object-cover">
        <div class="text-center mx-6 my-4">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center mb-10 mx-6 text-xs">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="text-xs absolute bottom-2 left-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-sky-400">Read more</a>
      </div>
    </div>
    <h2 id="section-2" class="container mx-auto text-2xl font-extrabold pb-16 pt-16">Co-authored Publications</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
      <div v-for="paper in coauthor" :key="paper.title" class=" dark:bg-slate-700 relative shadow-lg shadow-slate-500 dark:shadow-sky-500/50 rounded-xl transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-500 hover:dark:shadow-sky-500 hover:-translate-y-2">
        <div class="text-center font-semibold mx-6 my-4">{{ paper.title }}</div>
        <div class="text-center mx-6 my-4">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center mb-10 mx-6 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="text-xs absolute bottom-2 left-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-sky-400">Read more</a>
      </div>
    </div>
    
    <div class="size-16"></div>
  </html>
</template>



  
<style>
.underline-transition {
    transition: text-decoration-color 1s, text-decoration-thickness 1s;
}


</style>