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
  <html class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-sans">
    <h2 id="section-1" class="container mx-auto text-2xl pb-12 pt-12">First author publications</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 scroll-pb-20">
      <div v-for="paper in publications" :key="paper.title" class=" dark:bg-slate-700 relative shadow-lg shadow-slate-600 dark:shadow-slate-600 rounded-lg transition duration-100 ease-linear hover:shadow-xl hover:shadow-slate-600 hover:-translate-y-2 pb-10">
        <div class="text-center font-bold m-6">{{ paper.title }}</div>
        <img :src="paper.image" class="object-bottom w-full h-36 px-8 object-cover rounded-lg" alt="paper image">
        <div class="text-center m-8">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center m-8 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="text-sm absolute bottom-0 left-2 m-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-purple-600">Read more</a>
      </div>
    </div>
    <div class="container max-w-screen-2xl border-b border-gray-200"></div>
    <h2 id="section-2" class="container mx-auto text-2xl text-slate-500 dark:text-slate-400 font-semibold font-sans text-left pb-12 pt-12">Co-authored Publications</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 font-sans font-light text-slate-500 dark:text-slate-400 pb-12">
      <div v-for="paper in coauthor" :key="paper.title" class="border border-1 border-slate-500 dark:border-slate-400 bg-white dark:bg-slate-800 relative shadow-md shadow-slate-500 max-h-md max-w-md mx-auto rounded-md transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-600 hover:-translate-y-2 pb-10">
        <div class="text-center font-bold m-8">{{ paper.title }}</div>
        <div class="text-center m-8">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center mx-8 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="text-sm absolute bottom-0 left-2 m-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-purple-600">Read more</a>
      </div>
    </div>
    <div class="container max-w-screen-2xl border-b border-gray-200"></div>
    <h2 id="section-3" class="container mx-auto text-2xl text-zinc-700 dark:text-slate-400 font-semibold font-sans pb-8 pt-8">Preprints</h2>
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 font-sans font-light text-zinc-800 dark:text-slate-400 pb-12">
      <div v-for="paper in preprints" :key="paper.title" class="border border-1 border-slate-500 dark:border-slate-400 bg-transparent dark:bg-slate-600 relative shadow-md shadow-slate-500 max-h-lg max-w-md mx-auto rounded-md transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-600 hover:-translate-y-2 pb-10 hover:-m-2">
        <div class="text-center font-bold m-6">{{ paper.title }}</div>
        <img :src="paper.image" class="w-full h-36 px-8 object-cover rounded-lg" alt="paper image">
        <div class="text-center m-8">{{ paper.journal }}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center m-8 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#'" class="text-sm absolute bottom-0 left-2 m-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-purple-600">Read more</a>
      </div>
    </div>
    <div class="size-12"></div>
  </html>
</template>



  
<style>
.underline-transition {
    transition: text-decoration-color 0.7s, text-decoration-thickness 0.7s;
}

.bg-svg {
    background-image: url('/images/simple.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
}

</style>