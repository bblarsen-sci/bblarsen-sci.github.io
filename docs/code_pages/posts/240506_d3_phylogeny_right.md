---
layout: page
title: D3 phylogeny linear
aside: false
date: 2024-05-06
keywords:
    - D3
subtext: Nipah phylogeny built with D3
thumbnail: /thumbnails/phylogeny_right.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
    <div ref="svgContainer" class=""></div>
</D3PlotContainer>


<script setup>
import * as d3 from 'd3';
import { onMounted, ref, computed } from 'vue';
import { parseNewick, projection, diagonal, scaleBranchLengths } from '/components/treeUtilities.js'

const svgContainer = ref(null);
const data = ref(null);

function setColor(d) {
  if (d.children) {
    const childColors = d.children.map(child => setColor(child));
    const uniqueColors = [...new Set(childColors)];
    d.color = uniqueColors.length === 1 ? uniqueColors[0] : '#ccc'; // Set gray color for mixed descendants
  } else {
    const country = d.data.country;
    d.color = colorScale.value.domain().indexOf(country) >= 0 ? colorScale.value(country) : null;
  }
  return d.color;
}

const root = computed(() =>
  d3.hierarchy(data.value, d => d.branchset)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id))
    .sum((d) => d.branchLength || 0)
);

const tree = computed(() =>
  d3.cluster()
    .size([height - margin.top - margin.bottom, width - margin.right - margin.left])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    })
);

const countries = computed(() =>
  Array.from(new Set(root.value.descendants().map(d => d.data.country))).filter(Boolean)
);

const colorScale = computed(() =>
  d3.scaleOrdinal()
    .domain(countries.value)
    .range(d3.schemeCategory10)
);

const legend = svg => {
  const g = svg
    .selectAll("g")
    .attr("class", "legend")
    .data(colorScale.value.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(${margin.left + 50}, ${i * 20})`);

  g.append("circle")
    .attr("class", "legendcircle")
    .attr("r", 5)
    .attr("stroke", "currentColor")
    .attr("fill", colorScale.value);

  g.append("text")
    .attr("class", "legend-text")
    .attr("x", 10)
    .attr("dy", "0.1em")
    .text(d => d);
}

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 500
const height = 400

function drawChart() {

  // ROOT TO GET X,Y POSITIONS
  tree.value(root.value);
  //setColor(root.value);

  // SCALE BRANCH LENGTHS IF SCALED
  scaleBranchLengths(root.value.descendants(), width-margin.left-margin.right);

  //DRAW SVG
  var svg = d3.select(svgContainer.value).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr('viewBox', [0, 0, width, height])
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.append("g")
    .call(legend);

  //DRAW LINKS
  svg.append("g")
    .attr("class", "link")
    .selectAll("path")
    .data(root.value.links())
    .join("path")
    .attr("d", diagonal)
    //.attr("stroke", d => d.target.color)

  //DRAW NODES
  svg.append("g")
    .selectAll("circle")
    .data(root.value.descendants().filter(d => !d.children))
    .join("circle")
    .attr("r", 4)
    .attr("stroke", "currentColor")
    .attr("fill", d => colorScale.value(d.data.country))
    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });
}

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedNewick = parseNewick(csv);
  return parsedNewick;
};
onMounted(async () => {
  data.value = await fetchData();
  drawChart();
});
</script>

<style>
.legend-text {
  text-anchor: start;
  alignment-baseline: middle;
  fill: currentColor;
}

.legendcircle {
  stroke-width: 1;
}

.link {
  fill: none;
  stroke: black;
  stroke-width: 1.25;
}
</style>

