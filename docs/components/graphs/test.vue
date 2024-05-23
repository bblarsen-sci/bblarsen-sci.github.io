<template>
  <div ref="treeContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const data = ref(null);

const fetchData = async() => {
  try {
    const response = await fetch('/data/CHO_bEFNB2_entry.csv');
    const result = await response.text();
    const csv = d3.csvParse(result);
    data.value = csv;
  } catch (error) {
    console.error(error);
  }
}  

onMounted(() => {
  fetchData();
  const thing = data.value
  console.log(thing)
});


</script>

<style scoped>
</style>