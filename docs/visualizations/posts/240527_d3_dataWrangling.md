---
layout: doc
title: Test different code style
aside: false
date: 2024-05-27
keywords:
  - D3
subtext: Make a basic plot but put syntax logic in vue instead of D3
thumbnail: /thumbnails/data_wrangling.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>

<div class="flex flex-col items-center font-light" ref="svgContainer"></div>
  <div class="flex flex-col items-center">
    <svg :width="width" :height="height">
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <circle v-for="(dataPoint, index) in dataset" :key="index" :cx="xScale(dataPoint.site)"
          :cy="yScale(dataPoint.entry)" :r="r" fill="indianred" stroke="currentColor" />
        <g ref="xAxisGroup" :transform="`translate(0, ${innerHeight})`"></g>
        <g ref="yAxisGroup"></g>
        <g id='x-axis-label' :transform="`translate(${innerWidth / 2}, ${innerHeight + marginBottom - 5})`">
          <text text-anchor="middle" font-size="14">
            Site
          </text>
        </g>
        <g id='y-axis-label' :transform="`translate(${-marginLeft + 10}, ${innerHeight/2})`">
          <text text-anchor="middle" font-size="14" transform="rotate(-90)">
            Entry
          </text>
        </g>
      </g>
    </svg>
  </div>
</D3PlotContainer>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import * as d3 from 'd3';

const dataset = ref(null);
const r = ref(3);

const xAxisGroup = ref(null);
const yAxisGroup = ref(null);

const width = 600;
const height = 400;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 50;
const marginLeft = 50;

const innerWidth = width - marginLeft - marginRight;
const innerHeight = height - marginTop - marginBottom;

const dataFile =
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv';

async function fetchData() {
  const response = await fetch(dataFile);
  const data = await response.text();
  const csv = d3.csvParse(data);
  const array = csv.map((d) => ({
    site: +d.site,
    wildtype: d.wildtype,
    mutant: d.mutant,
    entry: +d.entry_CHO_bEFNB3,
  }));
  const groups = d3.group(array, (d) => d.site, (d) => d.wildtype);
  const meanData = Array.from(groups, ([site, siteData]) => {
    const wildtypeData = Array.from(siteData, ([wildtype, values]) => ({
      site,
      wildtype,
      entry: d3.mean(values, (d) => d.entry),
    }));
    return wildtypeData;
  }).flat();
  dataset.value = meanData
}
fetchData()

const xScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(dataset.value, (d) => d.site))
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

watchEffect(() => {
  if (dataset.value) {
  d3.select(xAxisGroup.value).call(xAxisGenerator.value);
  d3.select(yAxisGroup.value).call(yAxisGenerator.value);
  }
});
</script>

