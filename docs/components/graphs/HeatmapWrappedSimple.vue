<template>
  <svg ref="svgContainer"></svg>
  <Tooltip ref="tooltip" :data="tooltipData" />
</template>

<script setup>
import { ref, computed, watch, shallowRef } from 'vue';
import * as d3 from 'd3';
import { Legend } from '/components/utilities/legend.js';
import { useFetch } from '/components/composables/useFetch.js';
import Tooltip from '/components/components/simpleTooltip.vue';

// DEFINE VARIABLES
const svgContainer = shallowRef(null);
const processedData = shallowRef(null);
const tooltip = ref(null);
const tooltipData = ref([]);

// Fetch the data from the URL using composable
const { data } = useFetch(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv'
);

function processData() {
  const array = data.value.map((d) => ({
    site: +d.site,
    wildtype: d.wildtype,
    mutant: d.mutant,
    effect: +parseFloat(d.entry_CHO_bEFNB3).toFixed(2),
  }));
  processedData.value = array;
}

watch(data, (newData) => {
  if (newData) {
    processData();
  }
});

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

// DEFINE D3 FUNCTIONS
const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
const rowPadding = 30; // amount of padding between the rows
let rows = 4; // number of rows in the heatmap
let paddingValue = 0.1; // padding between the squares in the heatmap
const squareSize = 10;
const color = 'interpolateRdBu';
const min = -4;
const max = 2;



function getUniqueWildtypes() {
  const map = new Map();
  processedData.value.forEach((d) => {
    if (!map.has(+d.site)) {
      map.set(+d.site, d.wildtype);
    }
  });
  return map;
}

function updateHeatmap() {
  console.log('updating heatmap');

  function zoomed(event) {
    chartGroup.attr('transform', event.transform);
  }

  const dataLookup = processedData.value.reduce((lookup, dataPoint) => {
    lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
    return lookup;
  }, {});

  const wildtypeLookup = processedData.value.reduce((lookup, dataPoint) => {
    lookup[dataPoint.site] = dataPoint.wildtype;
    return lookup;
  }, {});

  const sites = Array.from(new Set(processedData.value.map((d) => +d.site)));

  const sitesPerRow = Math.ceil(sites.length / rows);

  const siteRows = Array.from({ length: rows }, (_, i) =>
    sites.slice(i * sitesPerRow, (i + 1) * sitesPerRow)
  );

  const maxSitesInRow = Math.max(...siteRows.map((row) => row.length));

  const innerWidth = squareSize * maxSitesInRow;

  const width = innerWidth + margin.left + margin.right;

  const uniqueWildtypes = getUniqueWildtypes();

  const yScale = d3
    .scaleBand()
    .domain(amino_acids)
    .range([0, squareSize * amino_acids.length])
    .padding(paddingValue);

  const xScale = d3
    .scaleBand()
    .domain(Array.from({ length: maxSitesInRow }, (_, i) => i))
    .range([0, innerWidth])
    .padding(paddingValue);

  const height =
    squareSize * amino_acids.length * rows +
    margin.top +
    margin.bottom +
    rowPadding * (rows - 1) +
    margin.bottom;

  const innerHeight = height - margin.top - margin.bottom;

  const colorScale = d3.scaleDiverging(d3[color]).domain([min, 0, max]);
  // Append a new SVG element to the container
  const svgElement = d3
    .select(svgContainer.value)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .call(d3.zoom().on('zoom', zoomed)); // Add zoom behavior to the SVG

  const chartGroup = svgElement
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  //Plot heatmap squares by row for wrapping
  siteRows.forEach((siteRow, rowIndex) => {
    chartGroup
      .selectAll(`rect-row-${rowIndex}`)
      .data(siteRow.flatMap((site) => amino_acids.map((mutant) => ({ site, mutant }))))
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(siteRow.indexOf(d.site)))
      .attr('y', (d) => yScale(d.mutant) + (yScale.range()[1] + rowPadding) * rowIndex)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => {
        const key = `${d.site}-${d.mutant}`;
        if (dataLookup[key]) {
          return colorScale(+dataLookup[key].effect);
        } else {
          return wildtypeLookup[d.site] === d.mutant ? 'white' : 'lightgray';
        }
      })
      .on('mouseover', (event, d) => {
        tooltip.value.showTooltip(event);
        tooltipData.value = [
          { label: 'Site', value: d.site },
          { label: 'Wildtype', value: wildtypeLookup[d.site] },
          { label: 'Mutant', value: d.mutant },
          {
            label: 'Effect',
            value: parseFloat(dataLookup[`${d.site}-${d.mutant}`].effect.toFixed(2)),
          },
        ];
      })
      .on('mouseout', () => {
        tooltip.value.hideTooltip();
        tooltipData.value = [];
      });
    // Add the wildtype 'X' text to the boxes
    chartGroup
      .selectAll(`.wildtype-row-${rowIndex}`)
      .data(Array.from(uniqueWildtypes.entries()).filter(([site]) => siteRow.includes(+site)))
      .enter()
      .append('text')
      .attr('class', `wildtype-row`)
      .attr('x', ([site]) => xScale(siteRow.indexOf(+site)) + xScale.bandwidth() / 2)
      .attr(
        'y',
        ([, wildtype]) =>
          yScale(wildtype) +
          (yScale.range()[1] + rowPadding) * rowIndex +
          yScale.bandwidth() / 2 +
          3
      )
      .attr('text-anchor', 'middle')
      .attr('font-size', '8px')
      .attr('fill', 'black')
      .text('X');

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    if (siteRow.length <= 50) {
      xAxis.tickFormat((d) => siteRow[d]);
    } else {
      xAxis.tickFormat((d, i) => (i % 10 === 0 ? siteRow[d] : ''));
    }

    // add the x-axis to the chart
    chartGroup
      .append('g')
      .attr('class', `x-axis-row`)
      .attr(
        'transform',
        `translate(0, ${(yScale.range()[1] + rowPadding) * rowIndex + yScale.range()[1]})`
      )
      .call(xAxis)
      .selectAll('text')
      .attr('dx', '-7px')
      .attr('dy', '-5px')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'end')
      .attr('text-align', 'center');

    // add the y-axis to the chart
    chartGroup
      .append('g')
      .attr('class', `y-axis-row`)
      .attr('transform', `translate(0, ${(yScale.range()[1] + rowPadding) * rowIndex})`)
      .call(d3.axisLeft(yScale).tickSizeOuter(0));
  });
  // Add the row title
  chartGroup
    .append('text')
    .attr('class', 'axis-title-x')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight - 10)
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .text('Site');

  // Add the column title
  chartGroup
    .append('text')
    .attr('class', 'axis-title-y')
    .attr('x', -innerHeight / 2)
    .attr('y', -margin.left)
    .attr('dy', '1em')
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .attr('transform', 'rotate(-90)')
    .text('Amino Acid');

  Legend(d3.scaleDiverging([min, 0, max], d3[color]).clamp(true), {
    svgRef: svgContainer.value,
    title: 'Cell Entry',
    width: 150,
    tickValues: [min, 0, max],
    xcoord: 50,
    ycoord: height - 50,
    fontSize: 18,
  });
}

watch(processedData, () => {
  updateHeatmap();
});
</script>
