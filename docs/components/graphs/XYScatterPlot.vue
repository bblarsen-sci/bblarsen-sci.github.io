<template>
  <svg ref="svgContainer"></svg>
  <button class="download-btn" @click="downloadPNG(svgContainer)"></button>
  <Tooltip ref="tooltip" :data="tooltipData" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import * as d3 from 'd3';
import downloadPNG from '/components/utilities/downloadPNG.js';
import { useFetch } from '/components/composables/useFetch.js';
import Tooltip from '/components/components/simpleTooltip.vue';

//setup reactive variables
const processedData = ref(null);
const svgContainer = ref(null);
const tooltip = ref(null);
const tooltipData = ref([]);

const axisTitleFontSize = '18px';
const axisFontSize = '16px';
const colorDistant = '#b8b0ac';
const colorContact = '#5778a4';
const colorClose = '#e49444';

// Fetch the data from the URL using composable
const { data } = useFetch(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/entry/e2_e3_entry_filter_merged.csv'
);

//process data
function processData() {
  // Convert the data to an array of objects
  const array = data.value.map((d) => ({
    site: +d.site,
    wildtype: d.wildtype,
    mutant: d.mutant,
    effect_E2: +d.effect_E2,
    effect_E3: +d.effect_E3,
    wt_type: d.wt_type_E2,
  }));

  // Group the data by site
  const groupedData = d3.rollup(
    array,
    (v) => ({
      effect_E2: d3.mean(v, (d) => d.effect_E2),
      effect_E3: d3.mean(v, (d) => d.effect_E3),
      wt_type: v[0].wt_type,
    }),
    (d) => d.site
  );

  // Convert the grouped data back to an array
  const aggregatedData = Array.from(groupedData, ([site, values]) => ({
    site,
    ...values,
  }));
  // Set the reactive variable to the processed data
  processedData.value = aggregatedData;
  makeColorChart();
}

watch(data, () => {
  processData();
});

//dimensions
const width = 800;
const height = 800;
const marginTop = 40;
const marginRight = 40;
const marginBottom = 100;
const marginLeft = 100;

//determine x scale
const xScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(processedData.value, (d) => d.effect_E2))
    .range([marginLeft, width - marginRight]);
});

//determine x axis
const xAxisGenerator = computed(() => {
  return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
});

//determine y scale
const yScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(processedData.value, (d) => d.effect_E3))
    .range([height - marginBottom, marginTop]);
});

//determine y axis
const yAxisGenerator = computed(() => {
  return d3.axisLeft().scale(yScale.value).ticks(6).tickSizeOuter(0);
});



function makeColorChart() {
  
  const svg = d3.select(svgContainer.value).attr('viewBox', `0 0 ${width} ${height}`);
  //define different types of sites
  const contactSites = [
    239, 240, 241, 242, 305, 388, 389, 401, 402, 458, 488, 489, 490, 491, 492, 501, 504, 505, 506,
    507, 530, 531, 532, 533, 555, 557, 558, 559, 579, 580, 581, 583, 588,
  ];
  const closeSites = [
    556, 528, 216, 404, 243, 584, 529, 554, 497, 502, 218, 403, 390, 503, 494, 560, 217, 487, 499,
    589, 459, 304, 215, 351, 457, 500, 526, 302, 578, 508, 493, 438, 590, 441, 585, 582, 440, 534,
    236, 400, 527, 214, 586, 237, 439, 306, 394, 495, 587, 405, 553, 387,
  ];

  // Add x-axis line at y=0
  svg
    .append('line')
    .attr('x1', xScale.value(d3.min(processedData.value, (d) => d.effect_E2)))
    .attr('y1', yScale.value(0))
    .attr('x2', xScale.value(d3.max(processedData.value, (d) => d.effect_E2)))
    .attr('y2', yScale.value(0))
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1);

  // Add y-axis line at x=0
  svg
    .append('line')
    .attr('x1', xScale.value(0))
    .attr('y1', yScale.value(d3.min(processedData.value, (d) => d.effect_E3)))
    .attr('x2', xScale.value(0))
    .attr('y2', yScale.value(d3.max(processedData.value, (d) => d.effect_E3)))
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1);

  // Add circles to the scatter plot
  svg
    .append('g')
    .selectAll('circle')
    .data(processedData.value)
    .join('circle')
    .attr('cx', (d) => xScale.value(d.effect_E2))
    .attr('cy', (d) => yScale.value(d.effect_E3))
    .attr('r', 7)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5)
    .attr('fill', (d) => {
      if (contactSites.includes(d.site)) {
        return colorContact;
      } else if (closeSites.includes(d.site)) {
        return colorClose;
      } else {
        return colorDistant;
      }
    })
    .on('mouseover', (event, d) => {
      tooltip.value.showTooltip(event);
      tooltipData.value = [
        { label: 'Site', value: d.site },
        { label: 'Effect E2', value: parseFloat(d.effect_E2.toFixed(2)) },
        { label: 'Effect E3', value: parseFloat(d.effect_E3.toFixed(2)) },
      ];
    })
    .on('mouseout', () => {
      tooltip.value.hideTooltip();
      tooltipData.value = [];
    });

  // Add x-axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${height - marginBottom})`)
    .call(xAxisGenerator.value) //call x-axis generator
    .attr('font-size', axisFontSize)
    .call((g) =>
      g //add x-axis title
        .append('text')
        .attr('x', width / 2 + 50)
        .attr('y', marginBottom - 30)
        .attr('font-size', axisTitleFontSize)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text('Entry in CHO-bEFNB2')
    );

  // Add y-axis
  svg
    .append('g')
    .attr('transform', `translate(${marginLeft}, 0)`)
    .call(yAxisGenerator.value) //call y-axis generator
    .attr('font-size', axisFontSize)
    .call((g) =>
      g //add y-axis title
        .append('text')
        .attr('x', -height / 2 + 40)
        .attr('y', -marginLeft + 30)
        .attr('font-size', axisTitleFontSize)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text('Entry in CHO-bEFNB3')
    );

  // Define legend data
  const legendData = [
    { color: colorDistant, label: 'Distant' },
    { color: colorClose, label: 'Close' },
    { color: colorContact, label: 'Contact' },
  ];

  // Create legend group
  const legend = svg.append('g').attr('transform', `translate(${marginLeft}, ${marginTop})`);

  // Add legend header
  legend
    .append('text')
    .attr('x', 10)
    .attr('y', 75)
    .attr('font-size', axisTitleFontSize)
    .attr('font-weight', 'bold')
    .attr('fill', 'currentColor')
    .text('Receptor Distance');

  // Add legend items
  const legendItems = legend
    .selectAll('.legend-item')
    .data(legendData)
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 40})`);

  // Add colored circles to legend
  legendItems
    .append('circle')
    .attr('cx', 20)
    .attr('cy', 100)
    .attr('r', 10)
    .attr('fill', (d) => d.color)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2);

  // Add labels to legend
  legendItems
    .append('text')
    .attr('x', 35)
    .attr('y', 106)
    .attr('font-size', axisTitleFontSize)
    .attr('fill', 'currentColor')
    .text((d) => d.label);
}
</script>
