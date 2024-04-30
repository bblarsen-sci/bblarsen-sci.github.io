<template>
    <div ref="treeContainer"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import * as d3 from 'd3';
  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  
  const treeContainer = ref(null);
  
  onMounted(() => {
    renderTree();
  });
  
  watch(() => props.data, () => {
    renderTree();
  });
  
  function renderTree() {
    const width = 800;
    const height = 600;
  
    const tree = d3.tree().size([height, width - 160]);
  
    const root = d3.hierarchy(props.data);
    tree(root);
  
    const svg = d3.select(treeContainer.value)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(40,0)');
  
    const link = svg.selectAll('.link')
      .data(root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => `M${d.y},${d.x}C${d.y + 50},${d.x} ${d.parent.y + 50},${d.parent.x} ${d.parent.y},${d.parent.x}`);
  
    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);
  
    node.append('circle')
      .attr('r', 4);
  
    node.append('text')
      .attr('dx', d => d.children ? -8 : 8)
      .attr('dy', 3)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name);
  }
  </script>
  
  <style scoped>
  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 2px;
  }
  
  .node text {
    font-size: 12px;
  }
  
  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
  }
  </style>