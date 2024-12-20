<template>
  <svg ref="svgContainer"></svg>
  <button class="download-btn" @click="downloadPNGHandler"></button>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import * as d3 from 'd3';
import { Legend } from '/components/utilities/legend.js';
import downloadPNG from '/components/utilities/downloadPNG.js';

function downloadPNGHandler() {
  downloadPNG(svgContainer.value);
}

const dataset = ref(null);
const svgContainer = ref(null);

const width = 500;
const height = 150;
const marginTop = 40;
const marginRight = 20;
const marginBottom = 80;
const marginLeft = 20;

const innerWidth = width - marginLeft - marginRight;
const innerHeight = height - marginTop - marginBottom;

const dataFile = ref(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv'
);

async function fetchData() {
  const csv = await d3.csv(dataFile.value);
  const array = csv.map((d) => ({
    site: +d.site,
    wildtype: d.wildtype,
    mutant: d.mutant,
    entry: +d.entry_CHO_bEFNB3,
  }));
  const groups = d3.group(array, (d) => d.site);
  const meanData = Array.from(groups, ([site, siteData]) => ({
    site,
    entry: parseFloat(d3.mean(siteData, (d) => d.entry).toFixed(2)),
  }));
  dataset.value = meanData;
}
fetchData();

const xScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(dataset.value, (d) => d.site))
    .range([0, innerWidth]);
});

const xAxisGenerator = computed(() => {
  return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
});

const divergingColorScale = computed(() => {
  return d3
    .scaleDiverging(d3.interpolateRdBu)
    .domain([d3.min(dataset.value, (d) => d.entry), 0, d3.max(dataset.value, (d) => d.entry) + 1]);
});

let domains = [
  { start: 71, stop: 148, name: 'Stalk' },
  { start: 148, stop: 178, name: 'Neck/Linker' },
  //{ start: 166, stop: 178, name: 'Linker' },
  { start: 178, stop: 602, name: 'Head' },
];
const regions = computed(() => Array.from(new Set(domains.map((d) => d.name))).filter(Boolean));

const colorRegions = computed(() => {
  return d3.scaleOrdinal().domain(regions.value).range(d3.schemePaired);
});

let svg;
onMounted(() => {
  svg = d3
    .select(svgContainer.value)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${marginLeft}, ${marginTop})`);
});

function makeColorChart() {
  const colorWidth = innerWidth / dataset.value.length;

  svg
    .selectAll('.color-rect')
    .data(dataset.value, (d) => d.site)
    .join(
      (enter) =>
        enter
          .append('rect')
          .attr('class', 'color-rect')
          .attr('x', (d, i) => i * colorWidth)
          .attr('y', 0)
          .attr('width', colorWidth)
          .attr('height', innerHeight)
          .attr('fill', (d) => divergingColorScale.value(d.entry)),
      (update) =>
        update
          .transition()
          .duration(2000)
          .attr('fill', (d) => divergingColorScale.value(d.entry)),
      (exit) => exit.remove()
    );

  svg.selectAll('.other-rect')
    .data(domains)
    .enter()
    .append('rect')
    .attr('class', 'other-rect')
    .attr('x', d => xScale.value(d.start))
    .attr('y', -15)
    .attr('width', d => xScale.value(d.stop) - xScale.value(d.start))
    .attr('height', 5)
    .attr('fill', d=> colorRegions.value(d.name))

  svg.selectAll('.domain-text').append('g')
    .data(domains)
    .enter()
    .append('text')
    .attr('class', 'domain-text')
    .attr('x', d => xScale.value((d.start + d.stop) / 2))
    .attr('y', -16)
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .attr('font-size', '0.4em')
    .text(d => d.name)

  const xAxis = svg
    .append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxisGenerator.value)
    .attr('font-size', '0.5em');

  xAxis
    .append('text')
    .attr('class', 'text')
    .attr('x', innerWidth / 2)
    .attr('y', 30)
    .attr('fill', 'currentColor')
    .attr('text-anchor', 'middle')
    .attr('font-size', '1.5em')
    .text('Site');



  Legend(
    d3
      .scaleDiverging(
        [d3.min(dataset.value, (d) => d.entry), 0, d3.max(dataset.value, (d) => d.entry) + 1],
        d3.interpolateRdBu
      )
      .clamp(true),
    {
      svgRef: svgContainer.value,
      width: 100,
      title: 'Mean Cell Entry',
      tickValues: [
        d3.min(dataset.value, (d) => d.entry),
        0,
        d3.max(dataset.value, (d) => d.entry) + 1,
      ],
      xcoord: width - 110,
      ycoord: height - 50,
      fontSize: 8,
    }
  );
}

watchEffect(() => {
  if (dataset.value) {
    makeColorChart();
  }
});
</script>
