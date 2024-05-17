<template>
  <div ref="svgContainer" class="text-xs"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);

let dataSet = [
  { start: 1, stop: 634, name: 'LTR' },
  { start: 681, stop: 806, name: 'Psi' },
  { start: 1301, stop: 1536, name: 'RRE' },
  { start: 2225, stop: 2592, name: 'rTRE3GS' },
  { start: 2644, stop: 4356, name: 'RBP' },
  { start: 4446, stop: 4953, name: 'CMV' },
  { start: 5031, stop: 5723, name: 'ZsGreen' },
  { start: 5796, stop: 6395, name: 'PuroR' },
  { start: 6403, stop: 6991, name: 'WPRE' },
  { start: 7065, stop: 7698, name: 'LTR' },

];
const width = 400;
const height = 200;
const margin = { top: 20, right: 20, bottom: 40, left: 20 };

const x = d3.scaleLinear()
  .domain([0, d3.max(dataSet, d => d.stop)])
  .range([margin.left, width - margin.right])
  .nice();

const color = d3.scaleOrdinal(d3.schemeTableau10);

function startAnimation(svg, gRects, gLabels, gx, xTitle, backboneText) {
  gRects.attr("x", 1000);
  gLabels.attr("x", 1000);
  gx.attr('transform', `translate(1000,${height /2 + 10})`);
  xTitle.attr('x', 1000);
  backboneText.attr('opacity', 1);

  gRects.transition()
    .duration(3000)
    .ease(d3.easeCubicInOut)
    .attr("x", d => x(d.start));

  gLabels.transition()
    .duration(3000)
    .ease(d3.easeCubicInOut)
    .attr("x", d => (x(d.start) + x(d.stop)) / 2);

  gx.transition()
    .duration(3000)
    .ease(d3.easeCubicInOut)
    .attr('transform', `translate(0,${height / 2 + 15})`);

  xTitle.transition()
    .duration(3000)
    .ease(d3.easeCubicInOut)
    .attr('x', width / 2);

  backboneText.transition()
    .duration(3000)
    .attr('opacity', 0);

  setTimeout(() => {
    startAnimation(svg, gRects, gLabels, gx, xTitle, backboneText);
  }, 6000);
}

onMounted(() => {
  const svg = d3.select(svgContainer.value).append('svg')
    .attr('preserveAspectRatio', "xMinYMin meet")
    .attr("viewBox", [0, 0, width, height]);
  
  svg.append("g")
    .append("rect")
    .attr("fill", "currentColor")
    .attr("x", margin.left)
    .attr("y", height / 2)
    .attr("height", 10)
    .attr("width", width - margin.right - margin.left);

  const backboneText = svg.append('text')
    .attr('class', 'backbone-text')
    .attr('x', width / 2)
    .attr('y', height / 2 - 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('fill', 'currentColor')
    .text('Lentivirus Backbone');

  const gRects = svg.selectAll("rect.data")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("class", "data")
    .attr("fill", (d, i) => color(i))
    .attr("x", 1000)
    .attr("y", height / 2 -2)
    .attr("height", 14)
    .attr("width", d => x(d.stop) - x(d.start));

  const gLabels = svg.selectAll("text.label")
    .data(dataSet)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", 1000)
    .attr("y", height / 2 - 6)
    .attr("text-anchor", "middle")
    .attr("font-size", "6px")
    .attr("fill", (d, i) => color(i))
    .text(d => d.name);

  const gx = svg.append('g')
    //.attr('transform', `translate(1000,${height / 2 + 10})`)
    .call(d3.axisBottom(x).ticks(10).tickSizeInner(4))
    .call(g => g.select(".domain").remove())
    .attr('font-size', '6px')
    .attr('color', 'currentColor');

  const xTitle = svg.append('text')
    .attr('class', 'axis-title')
    .attr('x', 1000)
    .attr('y', height / 2 + 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '6px')
    .attr('fill', 'currentColor')
    .text('Position (bp)');

  startAnimation(svg, gRects, gLabels, gx, xTitle, backboneText);
});
</script>