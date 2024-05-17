<template>
  <div ref="treeContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const data = ref(null);
const treeContainer = ref(null);

function makePlot() {
  
  const group = d3.group(data.value, d => d.site, d => d.mutant);
  const root = d3.hierarchy(group);

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
    .attr("viewBox", [-dy / 3, x0 - dx, width, height])

  svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
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

  // Find the minimum and maximum values of entry_CHO_bEFNB2
  const minValue = d3.min(data.value, d => parseFloat(d.entry_CHO_bEFNB2));
  const maxValue = d3.max(data.value, d => parseFloat(d.entry_CHO_bEFNB2));

  // Create a color scale using d3.scaleSequential and d3.interpolateRdBu
  const colorScale = d3.scaleDiverging()
    .domain([-4, 0, 2])
    .interpolator(d3.interpolateRdBu);

  node.append("circle")
    .attr("fill", d => {
      if (d.depth === 3) {
        return colorScale(d.data.entry_CHO_bEFNB2);
      }
      //return "currentColor";
    })
    .attr("r", 5);

  node.append("text")
    .attr("dy", "0.31em")
    .attr("fill", "currentColor")
    .attr("x", d => d.children ? -10 :50)
    .attr("text-anchor", d => d.children ? "end" : "end")
    .text(d => {
      // Assuming depth 0 = root, depth 1 = site, depth 2 = mutant, depth 3 = entry_CHO_bEFNB2
      if (d.depth === 0) {
        return "Root"; // Label for root node
      } else if (d.depth === 1) {
        return d.data[0]; // Label for site
      } else if (d.depth === 2) {
        return d.data[0]; // Label for mutant
      } else if (d.depth === 3) {
        return d3.format(".2f")(parseFloat(d.data.entry_CHO_bEFNB2));
      }
    });

}
async function fetchData() {
  console.log('fetching data')
  const file = await fetch(`/data/CHO_bEFNB2_entry.csv`);
  const file_text = await file.text();
  const csv = d3.csvParse(file_text);
  return csv;
}

onMounted(async() => {
  data.value = await fetchData()
  makePlot()
});
</script>

<style scoped>
</style>