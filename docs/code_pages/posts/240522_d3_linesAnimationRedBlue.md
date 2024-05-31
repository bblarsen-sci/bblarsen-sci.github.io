---
layout: doc
title: D3 animated lines
aside: false
date: 2024-05-22
keywords:
  - D3
subtext: Moving red/blue lines with gradient applied on y-axis
thumbnail: /thumbnails/d3_lines_redblue.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>

<div class='' ref="svgContainer"></div>
</D3PlotContainer>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);

const width = 1000;
const height = 250;


// Function to generate data points
function generateData(start, stop, numPoints) {
  const step = (stop - start) / (numPoints - 1);
  return Array.from({ length: numPoints }, (_, i) => ({
    x: start + i * step,
    y: height / 2,
  }));
}

// Generate initial data points
let data = generateData(0, width, 3);
// Generate initial data points for multiple lines

const numLines = 10;
let datasets = Array.from({ length: numLines }, () => generateData(0, width, 10));

const x = d3.scaleLinear().domain([0, width]).range([0, width]);
const y = d3.scaleLinear().domain([0, height]).range([height, 0]);

function generateRandomCoordinates() {
  return datasets.map(data => {
    const newData = [...data];
    for (let i = 1; i < data.length - 1; i += 1) {
      newData[i] = {
        ...newData[i],
        y: Math.random() * height,
      };
    }
    return newData;
  });
}

// Create the SVG element
function createSvg() {
  const svg = d3.select(svgContainer.value).append('svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', [0, 0, width, height])


  const defs = svg.append('defs');

  const colorSchemes = [
    d3.interpolateBlues,
    d3.interpolateReds,
  ];

  colorSchemes.forEach((scheme, i) => {
    const gradient = defs.append('linearGradient')
      .attr('id', `lineGradient-${i}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', y(0))
      .attr('x2', 0)
      .attr('y2', y(height));

    const color = d3.scaleSequential().domain([0, height]).interpolator(scheme);

    gradient.selectAll('stop')
      .data(color.ticks().map((t, i, n) => ({ offset: `${100 * i / (n.length - 1)}%`, color: color(t) })))
      .enter().append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);
  });

  return svg;
}

function updatePath(svg) {
  svg.selectAll('path')
    .data(datasets)
    .join(
      enter => enter.append('path')
        .attr('mix-blend-mode', 'multiply')
        .attr('fill', 'none')
        .attr('stroke', (d, i) => `url(#lineGradient-${i})`)
        .attr('stroke-width', 1.5)
        .attr('opacity', 1)
        .attr('d', d3.line().curve(d3.curveBasis)
          .x(d => x(d.x))
          .y(d => y(d.y))),
      update => update
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr('d', d3.line().curve(d3.curveBasis)
          .x(d => x(d.x))
          .y(d => y(d.y))),
      exit => exit.remove()
    );
}

onMounted(() => {
  const svg = createSvg();

  updatePath(svg);

  setInterval(() => {
    datasets = generateRandomCoordinates();
    updatePath(svg);
  }, 3000);
});
</script>
