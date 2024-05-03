<template>
    <div ref="treeContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const treeContainer = ref(null);

async function fetchData() {
  const response = await fetch(`/data/CHO_bEFNB2_entry.csv`);
  const data = await response.text();
  const parsedData = d3.csvParse(data);
  const group = d3.group(parsedData, d => d.site, d => d.mutant);
  const root = d3.hierarchy(group);

  console.log(root)
  const width = 800;
  const dx = 10;
  const dy = width / (root.height + 1);

  // Create a tree layout.
  const tree = d3.tree().nodeSize([dx, dy]);

  // Sort the tree and apply the layout.
  root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
  tree(root);

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  // Compute the adjusted height of the tree.
  const height = x1 - x0 + dx * 2;

  const svg = d3.select(treeContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox", [-dy / 3, x0 - dx, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1.5)
    .selectAll()
      .data(root.links())
      .join("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

  const node = svg.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll()
    .data(root.descendants()) // Change to root.descendants() to include all nodes
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("r", 3);

  node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -5 : 5)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => {
      // Assuming depth 0 = root, depth 1 = site, depth 2 = mutant, depth 3 = entry_CHO_bEFNB2
      if (d.depth === 0) {
        return "Root"; // Label for root node
      } else if (d.depth === 1) {
        return d.data[0]; // Label for site
      } else if (d.depth === 2) {
        return d.data[0]; // Label for mutant
      } else if (d.depth === 3) {
        return d.data.entry_CHO_bEFNB2; // Label for entry_CHO_bEFNB2
      }
    });
  
}

onMounted(() => {
  fetchData()
});
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