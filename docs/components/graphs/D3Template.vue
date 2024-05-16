<template>
  <d3PlotContainer class="p-10">
    <div ref="svgContainer" class="flex flex-col items-center"></div>
  </d3PlotContainer>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import d3PlotContainer from '/components/layouts/d3PlotContainer.vue';
import * as d3 from 'd3';

const svgContainer = ref(null);
const dataset = ref(null);

const width = 800;
const height = 600;
const marginTop = 30;
const marginRight = 20;
const marginBottom = 20;
const marginLeft = 40;

//Scales
const x = computed(() => {
  return d3.scaleBand()
    .domain(d3.groupSort(dataset.value, ([d]) => -d.frequency, d => d.letter))
    .range([marginLeft, width - marginRight])
    .padding(0.1);
});
const y = computed(() => {
  return d3.scaleLinear()
    .domain([0, d3.max(dataset.value, d => d.frequency)])
    .range([height - marginBottom, marginTop]);
});
//SVG
function createSvg() {
  const svgElement = d3.select(svgContainer.value).append('svg')
    .attr('preserveAspectRatio', "xMinYMin meet")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  return svgElement;
}

function makePlot(svgElement) {

  svgElement.selectAll('g')
    .data(dataset.value)
    .enter()
    .append('rect')
    .attr("fill", "black")
    .attr("x", (d) => x.value(d.letter))
    .attr("y", (d) => y.value(d.frequency))
    .attr("height", (d) => y.value(0) - y.value(d.frequency))
    .attr("width", x.value.bandwidth());

  // Add the x-axis and label.
  svgElement.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x.value).tickSizeOuter(0))
      .attr('class', 'text')
      .attr('font-size', '16px')
      .call(g => g.select(".domain").remove())

  // Add the y-axis and label, and remove the domain line.
  svgElement.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y.value).tickFormat((y) => (y * 100).toFixed()))
      .attr('font-size', '16px')
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr('font-size', '16px')
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("(%)"));
}
async function fetchData() {
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