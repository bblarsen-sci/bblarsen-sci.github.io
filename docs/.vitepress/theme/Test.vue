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
    <span class="grid grid-flow-row-dense gap-2 mx-auto border border-green-400 text-sm">
      <div v-for="paper in publications" :key="paper.title" class="border border-yellow-400 relative">
        <div class="text-center m-4">{{ paper.title }}</div>
        <p class="line-clamp-4 text-center text-sm m-4">{{ paper.abstract }}</p>
      </div>
    </span>
</template>



  
