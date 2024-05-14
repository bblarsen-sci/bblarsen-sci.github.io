<template>
    <div>{{text}}</div>
    <div ref="el" id="div" class="svg-container border-2">
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useResizeObserver } from '@vueuse/core';
  import * as d3 from 'd3';
  
  const el = ref(null)
  const text = ref('')
  const width = ref(200)
  const height = ref(200)
  onMounted(() => {
    var svg = d3.select(el.value)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 300 300`)
      .classed("svg-content", true);
  
    svg.append("circle")
      .attr("cx", 150)
      .attr("cy", 150)
      .attr("r", 50)
  })
  
  useResizeObserver(el, (entries) => {
    const entry = entries[0]
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
    console.log(width.value, height.value)
    text.value = `width: ${width.value}, height: ${height.value}`
  })
  </script>
  
  <style scoped>
  .svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
    border: 1px solid black;
    
  }
  
  .svg-content {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }
  </style>