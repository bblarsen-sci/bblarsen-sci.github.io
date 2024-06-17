<template>
  <svg ref="svgContainer"></svg>
  <button class="download-btn" @click="downloadPNG(svgContainer)"></button>
</template>

<script setup>
import { onMounted, shallowRef } from 'vue';
import * as d3 from 'd3';
import { makeData } from '/components/composables/useRandomData.js';
import downloadPNG from '/components/utilities/downloadPNG.js';

const data = shallowRef(null);
const svgContainer = shallowRef(null);

const width = 600;
const height = 300;
const dispersion = 100;
const dataPoints = 5000;
const type = 'uniform';

data.value = makeData(width, height, dispersion, dataPoints, type);

const colorScale = d3
  .scaleLinear()
  .domain(d3.extent(data.value, (d) => d[0]))
  .range(['indianred', 'steelblue'])
  .interpolate(d3.interpolateHsl)
  .clamp(true);

function zoomed({ transform }) {
  g.attr('transform', transform);
}

onMounted(() => {
  const svg = d3.select(svgContainer.value).attr('viewBox', `0 0 ${width} ${height}`);
  const g = svg.append('g');
  g.selectAll('circle')
    .data(data.value)
    .join('circle')
    .attr('cx', ([x]) => x)
    .attr('cy', ([, y]) => y)
    .attr('r', 2.5)
    .attr('fill', (d) => colorScale(d[0]));

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
});
</script>
