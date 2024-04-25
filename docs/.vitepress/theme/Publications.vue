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
  <html class="bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400 font-normal">
    <div class="mx-6 text-xs md:text-base">
    <h2 class="container mx-auto text-2xl font-extrabold py-12">Preprints</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div v-for="paper in preprints" :key="paper.title" class=" relative shadow-lg shadow-slate-400 dark:bg-slate-700 dark:shadow-sky-400/50 rounded-xl transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-500 hover:dark:shadow-sky-400 hover:-translate-y-2">
        <div class="text-center font-semibold mx-6 my-6">{{ paper.title }}</div>
        <img :src="paper.image" class="container mx-auto w-60 h-24 md:h-32 lg:h-36 mx-6 object-cover shadow-md shadow-slate-500" alt="paper image">
        <div class="text-center mx-6 my-6">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-3 md:line-clamp-4 text-left mb-10 mx-6">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="absolute bottom-2 right-2 text-sky-500 after:content-['_↗']  hover:underline underline-offset-4 decoration-2 transition duration-200 hover:text-sky-600">Read more</a>
      </div>
    </div>
    <h2 id="section-1" class="container mx-auto text-2xl font-extrabold py-12">First author publications</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div v-for="paper in publications" :key="paper.title" class=" dark:bg-slate-700 relative shadow-lg shadow-slate-500 dark:shadow-sky-500/50 rounded-xl transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-500 hover:dark:shadow-sky-500 hover:-translate-y-2">
        <div class="text-center font-semibold mx-6 my-6">{{ paper.title }}</div>
        <img :src="paper.image" class="container mx-auto w-60 h-24 md:h-32 lg:h-36 mx-6 object-cover shadow-md shadow-slate-500">
        <div class="text-center mx-6 my-6">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-3 md:line-clamp-4 text-left mb-10 mx-6">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="absolute bottom-2 right-2 text-sky-500 after:content-['_↗']  hover:underline underline-offset-4 decoration-2 transition duration-200 hover:text-sky-600">Read more</a>
      </div>
    </div>
    <h2 id="section-2" class="container mx-auto text-2xl font-extrabold py-12">Co-authored Publications</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <div v-for="paper in coauthor" :key="paper.title" class=" dark:bg-slate-700 relative shadow-lg shadow-slate-500 dark:shadow-sky-500/50 rounded-xl transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-500 hover:dark:shadow-sky-500 hover:-translate-y-2">
        <div class="text-center font-semibold mx-6 my-6">{{ paper.title }}</div>
        <div class="text-center mx-6 my-6">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-3 md:line-clamp-4 text-left mb-10 mx-6">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="absolute bottom-2 right-2  text-sky-500 after:content-['_↗']  hover:underline underline-offset-4 decoration-2 transition duration-200 hover:text-sky-600">Read more</a>
      </div>
    </div>
  </div>
    <div class="size-12"></div>
  </html>
</template>



  
<style>
</style>