<template>
  <svg id="svgContainer"></svg>
  <Tooltip ref="tooltip" :data="tooltipData" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as d3 from 'd3';
import { makeData } from '/components/composables/useRandomData.js';
import Tooltip from '/components/components/simpleTooltip.vue';

const data = ref(null);

const tooltip = ref(null);
const tooltipData = ref([]);

const width = 600;
const height = 400;
const dispersion = 40;
let svg;
let g;
let colorIndex = 0;

data.value = makeData(width, height, dispersion).data;


function makeChart() {
  console.log('data', data.value)
  svg = d3.select('#svgContainer').attr('viewBox', `0 0 ${width} ${height}`);
  g = svg.append('g');
  g.selectAll('circle')
    .data(data.value)
    .join('circle')
    .attr('cx', ([x]) => x)
    .attr('cy', ([, y]) => y)
    .attr('r', 3)
    .attr('fill', 'black')
    .on('mouseover', (event, d) => {
      tooltip.value.showTooltip(event);
      tooltipData.value = [
        { label: 'X', value: parseFloat(d[0].toFixed(1)) },
        { label: 'Y', value: parseFloat(d[1].toFixed(1)) },
      ];
    })
    .on('mouseout', () => {
      tooltip.value.hideTooltip();
      tooltipData.value = [];
    });

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

  //Start the color transition
  setInterval(() => {
    colorIndex = colorIndex === 9 ? 0 : colorIndex + 1;
    console.log('colorIndex', colorIndex);
    transition();
  }, 2500);
}

function findNearestNeighbors(circle, radius) {
  return data.value.filter(([x, y]) => {
    const distance = Math.sqrt((x - circle[0]) ** 2 + (y - circle[1]) ** 2);
    return distance <= radius && distance > 0;
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
        .filter((d) => d === circle)
        .transition()
        .duration(1000)
        .delay(delay)
        .ease(d3.easeLinear)
        .attr('fill', d3.schemeTableau10[colorIndex]);

      const neighbors = findNearestNeighbors(circle, 15);
      neighbors.forEach((neighbor) => {
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
    delay += 10;
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

