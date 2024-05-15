<template>
  <d3PlotContainer>
    <div ref="svgContainer" class="flex flex-col items-center"></div>
  </d3PlotContainer>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import d3PlotContainer from '/components/layouts/d3PlotContainer.vue';
import * as d3 from 'd3';

const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

const svgContainer = ref(null);
const data = ref(null);
const currentIndex = ref(0);
const sitesPerView = 25;
const height = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const innerHeight = height - margin.top - margin.bottom;
const squareSize = Math.min(innerHeight / amino_acids.length, 20);
const innerWidth = squareSize * sitesPerView;
const width = innerWidth + margin.left + margin.right;

let intervalId = null;

onUnmounted(() => {
  clearInterval(intervalId);
});

const allSites = computed(() => {
  return Array.from(new Set(data.value.map(d => +d.site)));
});

const colorScale = computed(() => {
  return d3.scaleDiverging(d3.interpolateRdBu)
    .domain([-4, 0, 4]);
});

const visibleSites = computed(() => {
  return allSites.value.slice(currentIndex.value * sitesPerView, (currentIndex.value + 1) * sitesPerView);
});

const dataLookup = computed(() => {
  return data.value.reduce((lookup, dataPoint) => {
    lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
    return lookup;
  }, {});
});

const wildtypeLookup = computed(() => {
  return data.value.reduce((lookup, dataPoint) => {
    lookup[dataPoint.site] = dataPoint.wildtype;
    return lookup;
  }, {});
});

function autoMove() {
  const totalSites = allSites.value.length;
  const totalPages = Math.ceil(totalSites / sitesPerView);
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % totalPages;
  }, 4000);
}

function createSvg() {
  const svg = d3.select(svgContainer.value);
  const svgElement = svg.append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  return svgElement;
}

function createScales() {
  const yScale = d3.scaleBand()
    .domain(amino_acids)
    .range([0, innerHeight])
    .padding(0.1);

  const xScale = d3.scaleBand()
    .domain(visibleSites.value)
    .range([0, innerWidth])
    .padding(0.1);

  return { xScale, yScale };
}

function createAxes(svgElement, xScale, yScale) {
  svgElement.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'end')
    .attr('dx', '-7px')
    .attr('dy', '-5px');

  svgElement.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).tickSizeOuter(0));
}

function updateRects(svgElement, xScale, yScale) {
  const allCombinations = visibleSites.value.flatMap(site =>
    amino_acids.map(mutant => ({ site, mutant })));

  const rect = svgElement.selectAll('rect')
    .data(allCombinations, d => `${d.site}-${d.mutant}`);

  rect.enter().append('rect')
    .attr('fill', 'white')
    .attr('x', d => xScale(d.site))
    .attr('y', d => yScale(d.mutant))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .merge(rect)
    .transition().delay((d,i) => i)
    .duration(500)
    //.ease(d3.easeLinear)
    .attr('x', d => xScale(d.site))
    .attr('fill', d => {
      const key = `${d.site}-${d.mutant}`;
      if (dataLookup.value[key]) {
        return colorScale.value(+dataLookup.value[key].entry_CHO_bEFNB2);
      } else {
        return wildtypeLookup.value[d.site] === d.mutant ? 'white' : 'transparent';
      }
    });

  rect.exit()
    .transition().delay(0)
    .duration(1000)
    .attr('x', -xScale.bandwidth() * 2)
    .attr('transform', 'scale(0)')
    .remove();
}

function updateWildtypeLabels(svgElement, xScale, yScale) {
  const filteredData = data.value.filter(d => visibleSites.value.includes(+d.site));
  const xText = svgElement.selectAll('.wildtype')
    .data(filteredData, d => d.site);

  xText.enter().append('text')
    .attr('class', 'wildtype')
    .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() /2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', '8px')
    .attr('font-weight', '100')
    .text('X')
    .merge(xText)
    .transition()
    .duration(2000)
    .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() / 2)

  xText.exit()
    .transition()
    .duration(2000)
    .attr('opacity', 0)
    .attr('x', -xScale.bandwidth() * 10)
    .remove();
}

function updateAxes(svgElement, xScale) {
  svgElement.select('.x-axis')
    .transition()
    .duration(1000)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'end')
    .attr('dx', '-7px')
    .attr('dy', '-5px');
}

onMounted(async () => {
  data.value = await fetchData();
  const svgElement = createSvg();
  createAxes(svgElement, createScales().xScale, createScales().yScale);
  const { xScale, yScale } = createScales();
  updateRects(svgElement, xScale, yScale);
  updateWildtypeLabels(svgElement, xScale, yScale);
  updateAxes(svgElement, xScale);
  autoMove();
  watch([currentIndex], () => {
    const { xScale, yScale } = createScales();
    updateRects(svgElement, xScale, yScale);
    updateWildtypeLabels(svgElement, xScale, yScale);
    updateAxes(svgElement, xScale);
  });
});

async function fetchData() {
  const file = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv');
  const file_text = await file.text();
  const csv = d3.csvParse(file_text);
  return csv;
}
</script>