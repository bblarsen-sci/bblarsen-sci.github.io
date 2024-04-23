<template>
    <svg viewBox="0 0 100 50" ref="svgRef" class="bg-slate-200"></svg>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import * as d3 from 'd3';
  
  // Simulating a dataset generation function
  function generateDataset() {
    return Array.from({length: 5}, () => [Math.random() * 100, Math.random() * 50]);
  }
  
  const svgRef = ref(null);
  const dataset = ref(generateDataset());
  console.log(dataset);
  function updateVisualization() {
    const svgElement = d3.select(svgRef.value);
    svgElement.selectAll("circle")
      .data(dataset.value)
      .join("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 1);
  }
  
  onMounted(() => {
    updateVisualization();
  
    // Set up an interval to update the dataset
    const intervalId = setInterval(() => {
      dataset.value = generateDataset();
      updateVisualization();
    }, 500);
  
    onUnmounted(() => {
      clearInterval(intervalId);
    });
  });
  </script>
  