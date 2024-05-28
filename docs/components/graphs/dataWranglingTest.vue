<template>
  <div class="flex flex-col items-center font-ultralight text-lg">
    <svg></svg>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import * as d3 from 'd3';

const dataset = ref(null);

const width = 800;
const height = 600;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 60;
const marginLeft = 60;

const circleRadius = 4;

const innerWidth =  width - marginLeft - marginRight;
const innerHeight = height - marginTop - marginBottom;

const dataFile =
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv';


async function fetchData() {
  const csv = await d3.csv(dataFile);
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

fetchData()

const xScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(dataset.value, d => d.site))
    .range([0, innerWidth])
    .nice();
});

const yScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(dataset.value, (d) => d.entry))
    .range([innerHeight, 0])
    .nice();
});

const xAxisGenerator = computed(() => {
  return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
});

const yAxisGenerator = computed(() => {
  return d3.axisLeft(yScale.value).tickSizeOuter(0);
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function renderChart() {
  const svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${marginLeft}, ${marginTop})`);

  const circles = svg.selectAll('circle')
    .data(dataset.value, d => d)
    .join('circle')
    .attr('cx', (d) => xScale.value(d.site))
    .attr('cy', (d) => yScale.value(d.entry))
    .attr('r', circleRadius)
    .attr('stroke', 'currentColor')
    .attr('fill', 'steelblue');

  const xAxis = svg.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxisGenerator.value)
    .attr('font-size', '12px')

  svg.append('g')
    .append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + marginBottom - 15)
    .attr('fill', 'currentColor')
    .attr('text-anchor', 'middle')
    .text('Site');

  svg.append('g')
    .attr('transform', `translate(0, 0)`)
    .call(yAxisGenerator.value)
    .attr('font-size', '12px')

  svg.append('text')
    .attr('x', -innerHeight / 2)
    .attr('y', -marginLeft + 15)
    .attr('fill', 'currentColor')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Entry');

  setInterval(() => {
    
    circles
      .transition()
      .duration(1000)
      .attr('fill', getRandomColor())
      


  }, 2000);
}


function makeColorChart() {
  const divergingColorScale = d3.scaleDiverging(d3.interpolateRdBu)
    .domain([-4, 0, 4]);

  const xScaleTest = d3.scaleLinear()
    .domain(d3.extent(dataset.value, d => d.site))
    .range([0, width - 50]);

  const xAxisGeneratorTest = d3.axisBottom().scale(xScaleTest).tickSizeOuter(0);

  const svg = d3.select('svg')
    .attr('viewBox', `0 0 ${width} ${height}`);

  const colorWidth = (width - 50) / dataset.value.length;

  svg.selectAll('.color-rect')
    .data(dataset.value)
    .enter()
    .append('rect')
    .attr('class', 'color-rect')
    .attr('x', (d, i) => 20 + i * colorWidth)
    .attr('y', 200)
    .attr('width', colorWidth)
    .attr('height', height / 8)
    .attr('fill', d => divergingColorScale(d.entry));

  const xAxis = svg.append('g')
    .attr('transform', `translate(${20}, ${200 + height / 8})`)
    .call(xAxisGeneratorTest)
    .attr('font-size', '12px');
}

watch(dataset, () => {
  //renderChart()
  makeColorChart()
});

</script>