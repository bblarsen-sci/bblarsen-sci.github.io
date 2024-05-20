<template>
  <div ref="svgContainer" class=""></div>
</template>
<script setup>
import * as d3 from 'd3';
import { onMounted, ref } from 'vue';
import { parseNewick, projection, diagonal, scaleBranchLengths } from '/components/treeUtilities.js';

const svgContainer = ref(null);

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 400;
const height = 400;

function createSvg() {
  const svg = d3.select(svgContainer.value).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr('viewBox', [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  return svg;
}
const tree = d3.cluster()
  .size([width - 100, height - 100])
  .separation(function separation(a, b) {
    return a.parent == b.parent ? 1 : 1;
  });
function drawChart(svg, data) {

  const root = d3.hierarchy(data, d => d.branchset)
    .sum((d) => d.branchLength || 0)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id))
  tree(root);

  svg.append("g")
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.25)
    .attr('stroke-opacity', 0.5)
    .selectAll()
    .data(root.links())
    .join('path')
    .attr("d", diagonal)

  svg.append('g')
    .attr('font-size', '3px')
    .attr('text-anchor', 'start')
    .selectAll('text')
    .data(root.leaves())
    .join('text')
    .text(d => d.data.name.replace(/'/g, '').replace(/\.1/g, '').replace(/\.2/g, ''))
    .attr('dx', '2px')
    .attr('transform', d => `translate(${d.y},${d.x})`)

}
onMounted(async () => {
  const data = await fetchData();
  const svg = createSvg();
  drawChart(svg, data);
});

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedNewick = parseNewick(csv);
  return parsedNewick;
}
</script>
