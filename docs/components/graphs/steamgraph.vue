

<template>
    <div ref="svgContainer" class=""></div>
</template>

<script setup>
//example taken from here https://observablehq.com/@d3/streamgraph-transitions?intent=fork
import * as d3 from 'd3';
import { onMounted, ref } from 'vue';

const svgContainer = ref(null);

const n = 10;
const m = 500;
const k = 20;
const width = 928;
const height = 200;

function createSvg() {
  const svg = d3.select(svgContainer.value).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr('viewBox', [0, 0, width, height]);
  return svg;
}

function bumps(m, k) {
  // Inspired by Lee Byron's test data generator.
  function bump(a, n) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < n; ++i) {
      const w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  const a = [];
  for (let i = 0; i < m; ++i) a[i] = 0;
  for (let i = 0; i < k; ++i) bump(a, m);
  return a;
}

function randomize(stack, y, bumps) {
  const layers = stack(d3.transpose(Array.from({ length: n }, () => bumps(m, k))));
  y.domain([
    d3.min(layers, l => d3.min(l, d => d[0])),
    d3.max(layers, l => d3.max(l, d => d[1]))
  ]);
  return layers;
}

function updateChart(svg, area, stack, y, z, bumps) {
  const transition = svg.transition()
    .duration(3000)
    .ease(d3.easePolyInOut);

  const path = svg.selectAll("path")
    .data(randomize(stack, y, bumps));

  path.enter().append("path")
    .attr("fill", () => z(Math.random()))
    .merge(path)
    .transition(transition)
    .attr("d", area);

  path.exit().remove();

  setTimeout(() => {
    updateChart(svg, area, stack, y, z, bumps);
  }, 4000);
}

onMounted(async () => {
  const svg = createSvg();
  const x = d3.scaleLinear([0, m - 1], [0, width]);
  const y = d3.scaleLinear([0, 1], [height, 0]);
  const z = d3.interpolateBlues;
  const area = d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));

  const stack = d3.stack()
    .keys(d3.range(n))
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderNone);

  updateChart(svg, area, stack, y, z, bumps);
});
</script>