<template>
  <svg ref="svgContainer">
    <g :transform="`translate(${margin.left}, ${margin.top})`">
      <g v-for="(siteRow, rowIndex) in siteRows" :key="rowIndex">
        <rect v-for="(d, index) in getSquareData(siteRow)" :key="index" :x="xScale(siteRow.indexOf(d.site))"
          :y="yScale(d.mutant) + (yScale.range()[1] + rowPadding) * rowIndex" :width="xScale.bandwidth()"
          :height="yScale.bandwidth()" :fill="getSquareFill(d)" @mouseover="showTooltip($event, d)"
          @mouseout="hideTooltip" />

        <text v-for="([site, wildtype], index) in Array.from(uniqueWildtypes).filter(([s]) => siteRow.includes(+s))"
          :key="index" :x="xScale(siteRow.indexOf(+site)) + xScale.bandwidth() / 2"
          :y="yScale(wildtype) + (yScale.range()[1] + rowPadding) * rowIndex + yScale.bandwidth() / 2 + 3"
          class="wildtype-text">
          X
        </text>

        <g :transform="`translate(0, ${(yScale.range()[1] + rowPadding) * rowIndex + yScale.range()[1]})`"
          class="x-axis">
          <text v-for="(tick, index) in xScale.domain()" :key="index" :x="xScale(tick)" :y="0" :dx="'-7px'" :dy="'-5px'"
            :transform="'rotate(-90)'" class="x-axis-text">
            {{ (index % 10 === 0) ? siteRow[tick] : '' }}
          </text>
        </g>

        <g :transform="`translate(0, ${(yScale.range()[1] + rowPadding) * rowIndex})`" class="y-axis" />
      </g>

      <text class="axis-title-x" :x="innerWidth / 2" :y="innerHeight - 10">
        Site
      </text>

      <text class="axis-title-y" :x="-innerHeight / 2" :y="-margin.left" transform="rotate(-90)">
        Amino Acid
      </text>
    </g>
  </svg>
  <Tooltip ref="tooltip" :data="tooltipData" />
</template>

<script setup>
import { ref, watch, shallowRef, computed } from 'vue';
import * as d3 from 'd3';
import { Legend } from '/components/utilities/legend.js';
import { useFetch } from '/components/composables/useFetch.js';
import Tooltip from '/components/components/simpleTooltip.vue';

// DEFINE VARIABLES
const svgContainer = shallowRef(null);
const tooltip = ref(null);
const tooltipData = ref([]);

const amino_acids = [
  'R',
  'K',
  'H',
  'D',
  'E',
  'Q',
  'N',
  'S',
  'T',
  'Y',
  'W',
  'F',
  'A',
  'I',
  'L',
  'M',
  'V',
  'G',
  'P',
  'C',
];

const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
const rowPadding = 30; // amount of padding between the rows
const rows = 4; // number of rows in the heatmap
const paddingValue = 0.1; // padding between the squares in the heatmap
const squareSize = 10;
const color = 'interpolateRdBu';
const min = -4;
const max = 2;

// Fetch the data from the URL using composable
const { data } = useFetch(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv'
);

const processedData = computed(() => {
  if (data.value) {
    return data.value.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      effect: +parseFloat(d.entry_CHO_bEFNB3).toFixed(2),
    }));
  }
  return [];
});

const uniqueWildtypes = computed(() => {
  const map = new Map();
  processedData.value.forEach((d) => {
    if (!map.has(+d.site)) {
      map.set(+d.site, d.wildtype);
    }
  });
  return map;
});

const siteRows = computed(() => {
  const sites = Array.from(new Set(processedData.value.map((d) => +d.site)));
  const sitesPerRow = Math.ceil(sites.length / rows);
  return Array.from({ length: rows }, (_, i) =>
    sites.slice(i * sitesPerRow, (i + 1) * sitesPerRow)
  );
});

const dataLookup = computed(() => {
  return processedData.value.reduce((lookup, dataPoint) => {
    lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
    return lookup;
  }, {});
});

const wildtypeLookup = computed(() => {
  return processedData.value.reduce((lookup, dataPoint) => {
    lookup[dataPoint.site] = dataPoint.wildtype;
    return lookup;
  }, {});
});

const maxSitesInRow = computed(() => {
  return Math.max(...siteRows.value.map((row) => row.length));
});

const innerWidth = computed(() => {
  return squareSize * maxSitesInRow.value;
});

const width = computed(() => {
  return innerWidth.value + margin.left + margin.right;
});

const height = computed(() => {
  return (
    squareSize * amino_acids.length * rows +
    margin.top +
    margin.bottom +
    rowPadding * (rows - 1) +
    margin.bottom
  );
});

const innerHeight = computed(() => {
  return height.value - margin.top - margin.bottom;
});

const yScale = computed(() => {
  return d3
    .scaleBand()
    .domain(amino_acids)
    .range([0, squareSize * amino_acids.length])
    .padding(paddingValue);
});

const xScale = computed(() => {
  return d3
    .scaleBand()
    .domain(Array.from({ length: maxSitesInRow.value }, (_, i) => i))
    .range([0, innerWidth.value])
    .padding(paddingValue);
});

const colorScale = computed(() => {
  return d3.scaleDiverging(d3[color]).domain([min, 0, max]);
});

function getSquareData(siteRow) {
  return siteRow.flatMap((site) => amino_acids.map((mutant) => ({ site, mutant })));
}

function getSquareFill(d) {
  const key = `${d.site}-${d.mutant}`;
  if (dataLookup.value[key]) {
    return colorScale.value(+dataLookup.value[key].effect);
  } else {
    return wildtypeLookup.value[d.site] === d.mutant ? 'white' : 'lightgray';
  }
}

function showTooltip(event, d) {
  tooltip.value.showTooltip(event);
  tooltipData.value = [
    { label: 'Site', value: d.site },
    { label: 'Wildtype', value: wildtypeLookup.value[d.site] },
    { label: 'Mutant', value: d.mutant },
    {
      label: 'Effect',
      value: dataLookup.value[`${d.site}-${d.mutant}`].effect,
    },
  ];
}

function hideTooltip() {
  tooltip.value.hideTooltip();
  tooltipData.value = [];
}

function zoomed(event) {
  d3.select(svgContainer.value).select('g').attr('transform', event.transform);
}

function addLegend() {
  Legend(colorScale.value.clamp(true), {
    svgRef: svgContainer.value,
    title: 'Cell Entry',
    width: 150,
    tickValues: [min, 0, max],
    xcoord: 50,
    ycoord: height.value - 50,
    fontSize: 18,
  });
}

watch(processedData, () => {
  const svgElement = d3.select(svgContainer.value).attr('viewBox', `0 0 ${width.value} ${height.value}`);
  svgElement.call(d3.zoom().on('zoom', zoomed));

  siteRows.value.forEach((siteRow, rowIndex) => {
    svgElement
      .select(`g.y-axis[transform="translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})"]`)
      .call(d3.axisLeft(yScale.value).tickSizeOuter(0));
  });

  addLegend();
});
</script>

<style scoped>
.wildtype-text {
  text-anchor: middle;
  font-size: 8px;
  fill: black;
}

.x-axis-text {
  text-anchor: end;
  text-align: center;
}

.axis-title-x {
  font-size: 18px;
  text-anchor: middle;
  fill: currentColor;
}

.axis-title-y {
  font-size: 18px;
  text-anchor: middle;
  fill: currentColor;
  dy: 1em;
}
</style>