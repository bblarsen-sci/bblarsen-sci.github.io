<template>
  <svg id="svgContainer"></svg>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, shallowRef } from 'vue';
import * as d3 from 'd3';
import { makeData } from '/components/composables/useRandomData.js';

const data = shallowRef(null);

const width = 400;
const height = 300;
const dispersion = 100;
const dataPoints = 5000;
const type = 'uniform';
let svg;
let g;
let colorIndex = 0;

data.value = makeData(width, height, dispersion, dataPoints, type).data;

const colorScale = computed(() =>
  d3
    .scaleLinear()
    .domain(d3.extent(data.value, (d) => d[0]))
    .range(['indianred', 'steelblue'])
    .interpolate(d3.interpolateHsl)
    .clamp(true)
);

function zoomed({ transform }) {
  g.attr('transform', transform);
}

function makeChart() {
  svg = d3.select('#svgContainer').attr('viewBox', `0 0 ${width} ${height}`);
  g = svg.append('g');
  g.selectAll('circle')
    .data(data.value)
    .join('circle')
    .attr('cx', ([x]) => x)
    .attr('cy', ([, y]) => y)
    .attr('r', 2.5)
    .attr('fill', (d) => colorScale.value(d[0]));

  svg.call(
    d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.5, 10])
      .on('zoom', zoomed)
  );
}

onMounted(() => {
  makeChart();
});

onUnmounted(() => {
  clearInterval(colorIndex);
});
</script>
