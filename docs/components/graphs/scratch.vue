<template>
  <svg id="svgContainer"></svg>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as d3 from 'd3';
import { makeData } from '/components/useRandomData.js';

const data = ref(null);
const width = 600;
const height = 400;
const dispersion = 50;
data.value = makeData(width, height, dispersion).data;
let svg;
let g;
let colorIndex = 1/256;

function makeChart() {
  svg = d3.select('#svgContainer').attr('viewBox', `0 0 ${width} ${height}`);
  g = svg.append('g');
  g.selectAll('circle')
    .data(data.value)
    .join('circle')
    .attr('cx', ([x]) => x)
    .attr('cy', ([, y]) => y)
    .attr('r', 3)
    .attr('fill', d3.interpolateViridis(0));

  //svg.call(
  //  d3
  //    .zoom()
  //    .extent([
  //      [0, 0],
  //      [width, height],
  //    ])
  //    .scaleExtent([0.5, 10])
  //    .on('zoom', zoomed)
  //);

  // Start the color transition
  setInterval(() => {
    colorIndex = colorIndex >= 1 ? (colorIndex = 1/256) : colorIndex + 1/10;
    console.log('colorIndex', colorIndex);
    transition();
  }, 2000);
}

function findNearestNeighbors(circle, radius) {
  return data.value.filter(([x, y]) => {
    const distance = Math.sqrt((x - circle[0]) ** 2 + (y - circle[1]) ** 2);
    return distance;
  });
}

function transition() {
  const randomCircle = data.value[Math.floor(Math.random() * data.value.length)];
  const circles = [randomCircle];
  const visitedCircles = new Set();

  function spreadColor(circle, delay) {
    if (!visitedCircles.has(circle)) {
      visitedCircles.add(circle);
      g.selectAll('circle')
        .filter(d => d === circle)
        .transition()
        .duration(1000)
        .delay(delay)
        .ease(d3.easeLinear)
        .attr('fill', d3.interpolateSpectral([colorIndex]));

      const neighbors = findNearestNeighbors(circle, 15);
      neighbors.forEach(neighbor => {
        if (!visitedCircles.has(neighbor)) {
          circles.push(neighbor);
        }
      });
    }
  }

  let delay = 0;
  while (circles.length > 0) {
    const circle = circles.shift();
    spreadColor(circle, delay);
    delay += 50;
  }
}

onMounted(() => {
  makeChart();
});

onUnmounted(() => {
  clearInterval(colorIndex);
});

function zoomed({ transform }) {
  g.attr('transform', transform);
}
</script>