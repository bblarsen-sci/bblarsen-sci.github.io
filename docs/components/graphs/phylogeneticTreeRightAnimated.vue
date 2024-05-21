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
let data = null;
let svg = null;





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

function createAndAnimatePlot() {

  
  let root = d3.hierarchy(data, d => d.branchset)
    .sum((d) => d.branchLength || 0)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id));



  tree(root);

  const countries = Array.from(new Set(root.descendants().map(d => d.data.country))).filter(Boolean)

  const colorScale = d3.scaleOrdinal()
      .domain(countries)
      .range(d3.schemeCategory10)

  const links = svg
    .append("g")
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.25)
    .attr('stroke-opacity', 0.5);

  const nodes = svg
    .append("g")
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5)
    

  function updateTree() {
    const duration = 2000; // Duration of the transition in milliseconds

    links.selectAll('path')
      .data(root.links())
      .join(
        enter => enter.append('path')
          .attr('stroke', 'black')
          .attr('d', diagonal),
        update => update.transition().duration(1000)
          .attr('d', diagonal),
        exit => exit.remove()
      );

      nodes.selectAll('circle')
      .data(root.descendants().filter(d => !d.children))
      .join(
        enter => enter
          .append('circle')
          .attr("fill", d => colorScale(d.data.country))
          .attr('transform', d => `translate(${d.y},${d.x})`)
          .attr('r', 4),
        update => update
          .transition()
          .duration(1000)
          .attr('transform', d => `translate(${d.y},${d.x})`),
        exit => exit.remove()
      );

    if (root.data.sorted === 'height') {
      root.sort((a, b) => b.value - a.value || d3.ascending(a.id, b.id));
      root.data.sorted = 'value';
    } else {
      root.sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id));
      root.data.sorted = 'height';
    }

    tree(root);

    setTimeout(updateTree, duration);
  }

  updateTree();
}

onMounted(async () => {
  data = await fetchData();
  svg = createSvg();
  createAndAnimatePlot();
});

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedNewick = parseNewick(csv);
  return parsedNewick;
}
</script>