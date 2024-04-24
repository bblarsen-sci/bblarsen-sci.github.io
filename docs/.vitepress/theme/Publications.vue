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
  <html>
<div class="container max-w-screen-2xl mx-auto p-12">
    <div class="text-center pb-12 ">
        <p class="text-4xl font-semibold font-sans text-slate-500 dark:text-slate-400">Publications</p>
    </div>
    <div class="flex grid grid-cols-1 gap-6 max-w-36 container mx-auto align-middle text-center">
        <a href="#section-1" class="bg-sky-600 hover:bg-sky-800 py-2 px-2 font-semibold rounded  text-white">First Author Publications</a>
        <a href="#section-2" class="bg-sky-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded">Co-authored</a>
        <a href="#section-3" class="bg-sky-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded">Preprints</a>
    </div>
</div>
  <div class=" container max-w-screen-2xl  border-b border-gray-400"></div>
  <h2 id="section-1" class="container mx-auto text-2xl text-slate-500 dark:text-slate-400 font-semibold font-sans pb-8 pt-8 ">First Author Publications</h2>
  <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 font-sans font-light text-slate-500 dark:text-slate-400 pb-12 ">
    <div v-for="paper in publications" :key="paper.title" class=" border border-1 border-slate-500 dark:border-slate-400 bg-white dark:bg-slate-800 relative shadow-md shadow-slate-500 max-h-lg max-w-md mx-auto rounded-md transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-600 hover:-translate-y-2 pb-10 hover:-m-2">
        <div class="text-center font-bold m-6">{{ paper.title }}</div>
        <img :src="paper.image" class="object-bottom w-full h-36 px-8 object-cover rounded-lg" alt="paper image">
        <div class="text-center m-8">{{ paper.journal}}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center m-8 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#' " class=" text-sm absolute bottom-0 left-2 m-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-purple-600">Read more</a>
    </div>
  </div>
<div class=" container max-w-screen-2xl border-b border-gray-400"></div>
  <h2 id="section-2" class="container mx-auto text-2xl text-slate-500 dark:text-slate-400 font-semibold font-sans text-left pb-12 pt-12 ">Coauthor Publications</h2>
  <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 font-sans font-light text-slate-500 dark:text-slate-400 pb-12" >
    <div v-for="paper in coauthor" :key="paper.title" class="border border-1 border-slate-500 dark:border-slate-400 bg-white dark:bg-slate-800 relative shadow-md shadow-slate-500 max-h-md max-w-md mx-auto rounded-md transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-600 hover:-translate-y-2 pb-10">
        <div class="text-center font-bold m-8">{{ paper.title }}</div>
        <div class="text-center m-8">{{ paper.journal}}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center mx-8 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#' " class="text-sm absolute bottom-0 left-2 m-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-purple-600">Read more</a>
        
  </div>
  
  </div>
  <div class=" container max-w-screen-2xl  border-b border-gray-400"></div>
  <h2 id="section-3" class="container mx-auto text-2xl text-slate-500 dark:text-slate-400 font-semibold font-sans pb-8 pt-8 ">Preprints</h2>
  <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 font-sans font-light text-slate-500 dark:text-slate-400 pb-12 ">
    <div v-for="paper in preprints" :key="paper.title" class=" border border-1 border-slate-500 dark:border-slate-400 bg-white dark:bg-slate-800 relative shadow-md shadow-slate-500 max-h-lg max-w-md mx-auto rounded-md transition duration-200 ease-in-out hover:shadow-xl hover:shadow-slate-600 hover:-translate-y-2 pb-10 hover:-m-2">
        <div class="text-center font-bold m-6">{{ paper.title }}</div>
        <img :src="paper.image" class=" w-full h-36 px-8 object-cover rounded-lg" alt="paper image">
        <div class="text-center m-8">{{ paper.journal}}, {{ paper.year }}</div>
        <p class="line-clamp-4 text-center m-8 text-sm">{{ paper.abstract }}</p>
        <a :href="paper.link || '#' " class=" text-sm absolute bottom-0 left-2 m-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-purple-600">Read more</a>
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