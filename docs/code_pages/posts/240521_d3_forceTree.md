---
layout: page
title: Force Tree
aside: false
date: 2024-05-21
keywords:
    - D3
subtext: D3 force phylogenetic tree
thumbnail: /thumbnails/d3_forceTree.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<svg></svg>
</D3PlotContainer>


<script setup>
import * as d3 from 'd3';
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { parseNewick, projection, diagonal, scaleBranchLengths } from '/components/treeUtilities.js';

const svgContainer = ref(null);

const width = 800;
const height = 600;
let data = null;
let svg = null;
const colorScale = ref(null);
let simulation = null;

function createSvg() {
  const svg = d3.select('svg')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    //.attr("style", "max-width: 100%; height: auto;");
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

  scaleBranchLengths(root.descendants(), width);

  const countries = Array.from(new Set(root.descendants().map(d => d.data.country))).filter(Boolean)

  colorScale.value = d3.scaleOrdinal()
    .domain(countries)
    .range(d3.schemeCategory10);

  return { root };
}

const drag = simulation => {

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

onMounted(async () => {
  data = await fetchData();
  const { root } = setupTree();
  svg = createSvg();

  const links = root.links();
  const nodes = root.descendants();
 
  simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter().strength(0.6))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const link = svg.append("g")
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.8)
    .selectAll("line")
    .data(links)
    .join("line");

  // Append nodes.
  const node = svg.append("g")
    .attr("stroke", "currentColor")
    .attr("stroke-width", 1)
    .selectAll("circle")
    .data(nodes.filter(d => !d.children))
    .join("circle")
    .attr("fill", d => colorScale.value(d.data.country))
    .attr("stroke", "currentColor")
    .attr("r", 7)
    .call(drag(simulation));

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });

});

onUnmounted(() => {
  if (simulation) {
    simulation.stop(); // Stop the simulation if it exists
  }
});

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedNewick = parseNewick(csv);
  return parsedNewick;
}
</script>

<style>

</style>
