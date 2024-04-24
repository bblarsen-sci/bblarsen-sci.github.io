<script>
export default {
  data() {
    return {
      publications: []
    };
  },
  mounted() {
    fetch('/papersSecond.json')
      .then(response => response.json())
      .then(data => {
        this.publications = data;
      });
  },
};
</script>

<template>
    <h1 class="text-2xl font-semibold">Co-author publications</h1>

  <div class="grid grid-rows-4 grid-flow-col gap-x-8 gap-y-10 px-6 py-6 flex-wrap content-center">
    <div v-for="paper in publications" :key="paper.title" class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-6 flex flex-col justify-center items-center">
        <div class="text-lg font-semibold text-center mb-2">{{ paper.title }}</div>
        <div class="text-md text-gray-600 text-center mb-2">{{ paper.journal }}</div>
        <div class="text-sm text-gray-500 text-center mb-4">{{ paper.authors }}</div>
        <a :href="paper.link || '#' " class="text-sm text-center mb-4 text-blue-500 hover:text-blue-700 transition-colors duration-300 ">Link</a>
    </div>
  </div>
</template>

  
<style>

</style>