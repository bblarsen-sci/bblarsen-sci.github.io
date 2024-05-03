<template>
    <div class="flex flex-col justify-center items-center">
      <button @click="generateNewTree">Generate New Tree</button>
      <div ref="testSVG"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';
  
  const testSVG = ref(null);
  
  const height = 400;
  const width = 400;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  
  let data = {
    id: "root",
    children: []
  };
  
  function generateChildren(parentNode, level) {
    const numChildren = Math.floor(Math.random() * 4); // Random number between 0 and 5
  
    for (let i = 0; i < numChildren; i++) {
      const childNode = {
        id: `${parentNode.id}_child${i + 1}`,
        children: []
      };
  
      if (level < 5) {
        generateChildren(childNode, level + 1);
      }
  
      parentNode.children.push(childNode);
    }
  }
  
  function generateNewTree() {
    data = {
      id: "root",
      children: []
    };
  
    generateChildren(data, 0);
    updateTree();
  }
  
  function updateTree() {
    const svg = d3.select(testSVG.value);
    svg.selectAll("*").remove();
  
    const svgElement = svg.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    const tree = d3.tree()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
  
    const root = d3.hierarchy(data, d => d.children)
        .sum(d => d.children ? 1 : 2)
        .sort((a, b) => b.height - a.height || b.value - a.value);
    tree(root);
  
    const g = svgElement.append("g")
      .attr("transform", `translate(0, ${root.dy})`);
  
    const link = g.selectAll(".link")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("class", "link")
      .attr("d", d => {
        return "M" + d.y + "," + d.x
          + "L" + d.parent.y + "," + d.parent.x;
      });
  
    const node = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("circle")
      .attr("class", "node")
      .attr("cx", d => d.y)
      .attr("cy", d => d.x)
      .attr("r", 4)
      .attr("fill", "indianred")
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }
  
  onMounted(() => {
    generateNewTree();
  });
  </script>