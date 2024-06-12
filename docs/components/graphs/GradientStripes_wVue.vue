<template>
    <svg :viewBox="[0, 0, width, height]">
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <g :transform="`translate(0, -2)`">
          <text fill="currentColor" text-anchor="start" font-size="10">{{ currentDataFrame === 'data1' ? 'CHO-bEFNB3' : 'CHO-bEFNB2' }}</text>
        </g>
        <rect
          v-for="(dataPoint, index) in currentProcessedData"
          :key="dataPoint.site"
          :x="index * colorWidth"
          :y="0"
          :width="colorWidth"
          :height="innerHeight"
          :fill="entryColorScale(dataPoint.entry)"
        />
        <g ref="xAxisGroup" :transform="`translate(0, ${innerHeight})`"></g>
        <g :transform="`translate(${innerWidth / 2}, ${innerHeight + marginBottom -5})`">
          <text fill="currentColor" text-anchor="middle" font-size="12" font-weight="bold">Site</text>
        </g>
      </g>
    </svg>
    <button class="btn-primary" @click="toggleDataFrame">Toggle Data</button>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import * as d3 from 'd3';
import { useFetch } from '/components/composables/useFetch.js';


const currentDataFrame = ref('data2');
const processedData1 = ref(null);
const processedData2 = ref(null);
const xAxisGroup = ref(null);

const width = 500;
const height = 100;
const marginTop = 15;
const marginRight = 20;
const marginBottom = 40;
const marginLeft = 20;
const innerWidth = width - marginLeft - marginRight;
const innerHeight = height - marginTop - marginBottom;

const { data: data } = useFetch(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv'
);

const { data: data2 } = useFetch(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv'
);

function processDataset(data) {
  const array = data.map((d) => ({
    site: +d.site,
    wildtype: d.wildtype,
    mutant: d.mutant,
    entry: +Object.values(d)[3],
  }));
  const groups = d3.group(array, (d) => d.site);
  const meanData = Array.from(groups, ([site, siteData]) => ({
    site,
    entry: parseFloat(d3.mean(siteData, (d) => d.entry).toFixed(2)),
  }));
  return meanData;
}

watch(data, () => {
    processedData1.value = processDataset(data.value);
});

watch(data2, () => {
    processedData2.value = processDataset(data2.value);
});

const currentProcessedData = computed(() => {
  return currentDataFrame.value === 'data1' ? processedData1.value : processedData2.value;
});

watch(currentProcessedData, () => {
    d3.select(xAxisGroup.value)
      .call(xAxisGenerator.value);
});

const xScale = computed(() => {
  return d3
    .scaleLinear()
    .domain([xScaleMin.value, xScaleMax.value])
    .range([0, innerWidth]);
});

const xScaleMin = computed(() => {
  return d3.min(currentProcessedData.value, (d) => d.site);
});

const xScaleMax = computed(() => {
  return d3.max(currentProcessedData.value, (d) => d.site);
});

const xAxisGenerator = computed(() => {
  return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
});

const colorMin = computed(() => {
  return d3.min(currentProcessedData.value, (d) => d.entry);
});

const colorMax = computed(() => {
  return d3.max(currentProcessedData.value, (d) => d.entry);
});

const entryColorScale = computed(() => {
  return d3
    .scaleDiverging(d3.interpolateRdBu)
    .domain([colorMin.value, 0, colorMax.value + 0.5]);
});

const colorWidth = computed(() => {
  return innerWidth / currentProcessedData.value.length;
});

function toggleDataFrame() {
  currentDataFrame.value = currentDataFrame.value === 'data1' ? 'data2' : 'data1';
}
</script>

