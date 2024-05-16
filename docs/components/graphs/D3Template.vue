<template>
    <div ref="svgContainer" class="flex flex-col items-center"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import d3PlotContainer from '/components/layouts/d3PlotContainer.vue';
import * as d3 from 'd3';

const svgContainer = ref(null);
const dataset = ref(null);

const width = 928;
const height = 500;
const marginTop = 30;
const marginRight = 0;
const marginBottom = 30;
const marginLeft = 40;

//Scales
const colorScale = computed(() => {
  return d3.scaleDiverging(d3.interpolateRdBu)
    .domain([-4, 0, 4]);
});

//SVG
function createSvg() {
  const svgElement = d3.select(svgContainer.value).append('svg')
    //.attr('width', width)
    //.attr('height', height)
    .attr("viewBox", [0, 0, width, height])
    //.append('g')
    //.attr('transform', `translate(${margin.left}, ${margin.top})`);
  return svgElement;
}


function makePlot(svgElement) {
  const xAxis = d3.scaleBand()
    .domain(d3.groupSort(dataset.value, ([d]) => -d.frequency, d => d.letter))
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  const yAxis = d3.scaleLinear()
    .domain([0, d3.max(dataset.value, d => d.frequency)])
    .range([height - marginBottom, marginTop]);

  svgElement.append("g")
    .attr("fill", "steelblue")
    .selectAll()
    .data(dataset.value)
    .join("rect")
    .attr("x", (d) => xAxis(d.letter))
    .attr("y", (d) => yAxis(d.frequency))
    .attr("height", (d) => yAxis(0) - yAxis(d.frequency))
    .attr("width", xAxis.bandwidth());
}
async function fetchData() {
  console.log('fetching data')
  const file = await fetch('/data/alphabet.csv');
  const file_text = await file.text();
  const csv = d3.csvParse(file_text);
  return csv;
}
onMounted(async () => {
  dataset.value = await fetchData();
  const svgElement = createSvg();
  makePlot(svgElement);
});
</script>