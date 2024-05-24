<template>
  <div ref="svgContainer"></div>
</template>

<script setup>
import * as d3 from 'd3';
import { onMounted, ref, computed } from 'vue';
import { parseNewick, projection, diagonal, scaleBranchLengths } from '/components/treeUtilities.js';

const svgContainer = ref(null);

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 600;
const height = 700;
let data = null;
let svg = null;
const colorScale = ref(null);

function createSvg() {
  const svg = d3.select(svgContainer.value).append("svg")
    .attr('viewBox', [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${margin.left-100}, ${margin.top})`);

  svg.append('g').attr('class', 'links');
  svg.append('g').attr('class', 'nodes');
  return svg;
}


function setupTree() {
  const tree = d3.cluster()
    .size([width, height])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    });

  const root = d3.hierarchy(data, d => d.branchset)
    .sum((d) => d.branchLength || 0)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id));

  tree(root);

  scaleBranchLengths(root.descendants(), width - margin.left - margin.right);

  const countries = Array.from(new Set(root.descendants().map(d => d.data.country))).filter(Boolean)

  colorScale.value = d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeCategory10);

  return { root };
}



function update(svg, root) {

  ////////LINKS
  const links = svg.select('g.links')
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.5)

  links.selectAll('path')
    .data(root.links())
    .join(
      enter => enter.append('path')
        .attr('d', diagonal),
      update => update
        .attr('d', diagonal),
      exit => exit.remove()
    );
  ////////NODES
  const nodes = svg.select('g.nodes')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 0.5)
    .attr('stroke', 'currentColor')

  nodes.selectAll('circle')
    .data(root.descendants().filter(d => !d.children))
    .join(
      enter => enter
        .append('circle')
        .attr("fill", d => colorScale.value(d.data.country))
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .attr('r', 4)
        .attr('filter', d => `drop-shadow(0 0 6px ${colorScale.value(d.data.country)})`),
      update => update
        .attr("fill", d => colorScale.value(d.data.country))
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .attr('r', 4)
        .attr('filter', d => `drop-shadow(0 0 6px ${colorScale.value(d.data.country)})`),
      exit => exit.remove()
    );
  
}

onMounted(async () => {
  data = await fetchData();
  const { root } = setupTree();

  svg = createSvg();

  ////////LEGEND
  const legendGroup = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${margin.left + 200}, ${margin.top})`);

  const legendItems = legendGroup.selectAll('.legend-item')
    .data(colorScale.value.domain())
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 20})`);

  legendItems.append('circle')
    .attr('r', 4)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 0.5)
    .attr('filter', d => `drop-shadow(0 0 6px ${colorScale.value(d)})`)
    .attr('fill', colorScale.value)
    

  legendItems.append('text')
    .attr('x', 8)
    .attr('y', 1)
    .attr('text-anchor', 'start')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'currentColor')
    .attr('font-size', '12px')
    .text(d => d);

  update(svg, root);
  
  setInterval(() => {
    root.each((d) => {
      //d.x = d.x + (Math.random()) * 10;
      //d.y = d.y + 10;
    });
    update(svg, root);
  }, 1000);
});

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedNewick = parseNewick(csv);
  return parsedNewick;
}
</script>

<style>
svg {
  /* important for responsiveness */
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
  background: #eee;
}
</style>