<template>
  <div class='' ref="svgContainer"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);
const dataFile = '/data/default_heatmap.csv';
const data = ref([]);

let dimensions = {
  width: 300,
  height: 125,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

async function fetchData() {
  try {
    const response = await fetch(dataFile);
    const file_text = await response.text();
    const csv = d3.csvParse(file_text);
    data.value = csv
  } catch (error) {
    console.error('Error fetching CSV file:', error);
  }
}
fetchData();

onMounted(() => {
  watch(data, () => {
    updateHeatmap();
  });
});



</script>