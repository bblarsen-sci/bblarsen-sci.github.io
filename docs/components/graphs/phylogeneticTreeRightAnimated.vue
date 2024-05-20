<template>
  <div ref="svgContainer" class=""></div>
</template>
<script setup>
import * as d3 from 'd3';
import { onMounted, ref } from 'vue';
import { parseNewick, projection, diagonal, scaleBranchLengths } from '/components/treeUtilities.js';

const svgContainer = ref(null);

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedNewick = parseNewick(csv);
  return parsedNewick;
}
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 400;
const height = 300;


function drawChart(data) {

  const root = d3.hierarchy(data, d => d.branchset)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id))
    .sum((d) => d.branchLength || 0);

  const tree = d3.cluster()
    .size([width - margin.right - margin.left, height - margin.top - margin.bottom ])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    });

  tree(root);

  const countries = Array.from(new Set(root.descendants().map(d => d.data.country))).filter(Boolean);
  const colorScale = d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeCategory10);

  const svg = d3.select(svgContainer.value).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr('viewBox', [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.append("g")
    .attr("class", "link")
    .selectAll("path")
    .data(root.links())
    .enter()
    .append('path')
    .attr("d", diagonal)
    .attr("stroke", "currentColor");

  svg.append("g")
    .selectAll("circle")
    .data(root.descendants().filter(d => !d.children))
    .join("circle")
    .attr("r", 2)
    .attr("stroke", "currentColor")
    .attr("fill", d => colorScale(d.data.country))
    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });
}

onMounted(async () => {
  const data = await fetchData();
  
  drawChart(data);
});
</script>
<style>
.link {
  fill: none;
  stroke: black;
  stroke-width: 1.25;
}
</style>