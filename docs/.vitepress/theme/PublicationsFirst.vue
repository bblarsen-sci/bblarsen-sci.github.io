<script>
export default {
  data() {
    return {
      publications: []
    };
  },
  mounted() {
    fetch('/papers/papersFirst.json')
      .then(response => response.json())
      .then(data => {
        this.publications = data;
      });
  },
};
</script>

<template>
  <h2 class="text-2xl font-light font-sans text-left mx-2 pb-6 pt-5 ">First author publications</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 m-2 gap-4 font-sans font-light">
    <div v-for="paper in publications" :key="paper.title" class=" text-white relative bg-gradient-to-t from-blue-400 to-red-400 shadow-md shadow-blue-400 max-h-lg max-w-md mx-auto rounded-md shadow-md transition duration-200 ease-in-out hover:shadow-xl hover:shadow-blue-600 hover:-translate-y-2 pb-10">
        <img :src="paper.image" class="object-bottom w-full h-48 p-4 object-cover rounded-lg" alt="paper image">
        <div class="text-left font-bold m-4">{{ paper.title }}</div>
        <div class="text-left m-4">{{ paper.journal}}, {{ paper.year }}</div>
        <p class="line-clamp-4 m-4">{{ paper.abstract }}</p>
        <a :href="paper.link || '#' " class=" absolute bottom-0 left-2 m-2 text-left hover:underline underline-offset-4 decoration-2 underline-transition hover:text-red-400">Read more</a>
    </div>
  </div>
</template>

  
<style>
.underline-transition {
    transition: text-decoration-color 0.7s, text-decoration-thickness 0.7s;
}
</style>