<template>
    <div style="margin: 1em 0;">
      <svg :width="width" :height="height" :viewBox="viewBox" fill="currentColor" style="overflow: visible; position: relative; max-width: 100%; height: auto;" ref="container"></svg>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import * as d3 from 'd3';
  import { useForceSimulation } from './useForceSimulation'; // Assuming the composition function is in a separate file
  
  const width = 700;
  const height = 540;
  const viewBox = computed(() => `-${width / 2} -${height / 2} ${width} ${height}`);
  
  const container = ref(null);
  const nodes = ref([]);
  
  // Custom composition function to handle the D3 force simulation
  const { simulation, initializeNodes } = useForceSimulation(container, nodes, width);
  
  onMounted(() => {
    nodes.value = generateNodes(200, width);
    initializeNodes();
  });
  
  onUnmounted(() => {
    simulation.stop();
  });
  
  function generateNodes(count, width) {
    const k = width / 200;
    const r = d3.randomUniform(k, k * 2);
    return Array.from({ length: count }, () => ({ r: r() }));
  }
  </script>