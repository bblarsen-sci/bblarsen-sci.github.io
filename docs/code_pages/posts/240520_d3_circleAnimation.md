---
layout: page
title: Circle animation Test
aside: false
date: 2024-05-20
keywords:
    - D3
subtext: playing around with D3 animations
thumbnail: /thumbnails/circle_animation.png
---


<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
  <div ref="svgContainer" class="bg-white"></div>
</D3PlotContainer>



<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);

const width = 300;
const height = 100;

// Generate initial data points
const x = d3.scaleLinear().domain([0, width]).range([0, width]);
const y = d3.scaleLinear().domain([0, height]).range([0, height]);

const generateDataset = () => (
  Array(20).fill(0).map(() => ([
    d3.randomNormal(width/2, width/6)(),
    d3.randomNormal(height/2, height/8)(),
  ]))
)
// Create the SVG element
function createSvg() {
  const svg = d3
    .select(svgContainer.value)
    .append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;')
  return svg;
}

onMounted(() => {
  const svg = createSvg();
  update(svg)
  setInterval(() => { update(svg) }, 3000);
});

function update(svg) {

  const data = generateDataset();

  // Define the diverging color scale
  const colorScale = d3.scaleDiverging(d3.interpolateRdBu)
    .domain([0, width / 2, width])
    
  svg.selectAll("circle")
    .data(data)
    .join(
      enter => enter.append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .transition()
        .duration(2000)
        .ease(d3.easePolyInOut)
        .attr('stroke', 'slategray')
        .style('mix-blend-mode', 'multiply')
        .attr('stroke-width', 0.5)
        .attr("r", 4)
        .attr('fill', d => colorScale(d[0])),
      update => update
        .transition()
        .duration(2000)
        .ease(d3.easePolyInOut)
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr('fill', d => colorScale(d[0])),
      exit => exit
        .remove()
    )
}
</script>


