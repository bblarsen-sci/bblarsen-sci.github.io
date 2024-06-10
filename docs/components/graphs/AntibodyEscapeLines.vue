<template>
  <svg ref="svgContainer"></svg>
  <button class="download-btn" @click="downloadPNGHandler"></button>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import * as d3 from 'd3';
import downloadPNG from '/components/utilities/downloadPNG.js';

function downloadPNGHandler() {
  downloadPNG(svgContainer.value);
}

const dataset = ref(null);
const svgContainer = ref(null);

const width = 800;
const height = 400;
const marginTop = 40;
const marginRight = 40;
const marginBottom = 60;
const marginLeft = 60;

const dataFile = ref(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_antibody_escape.csv'
);


async function fetchData() {
  // Load the CSV file using D3.js
  const csv = await d3.csv(dataFile.value);

  // Transform the CSV data into an array of objects
  const array = csv.map((d) => ({
    site: +d.site, // Convert site to a number
    wildtype: d.wildtype,
    mutant: d.mutant,
    escape: Math.max(0, +d.escape_mean), // Convert escape_mean to a number and ensure it's non-negative
    antibody: d.antibody,
  }));

  // Group the data by antibody and site, summing the escape values
  const groups = d3.rollup(
    array,
    (v) => d3.sum(v, (d) => d.escape), // Sum the escape values for each group
    (d) => d.antibody, // Group by antibody
    (d) => d.site // Group by site
  );

  // Convert the grouped data into an array of objects
  const antibodyData = Array.from(groups, ([antibody, siteData]) => ({
    antibody,
    sites: Array.from(siteData, ([site, escape]) => ({ site, escape })),
  }));

  // Assign the antibodyData to the dataset variable
  dataset.value = antibodyData;
}

fetchData();

const xScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(dataset.value[0].sites, (d) => d.site))
    .range([marginLeft, width - marginRight]);
});

const xAxisGenerator = computed(() => {
  return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
});

const yScale = computed(() => {
  return d3
    .scaleLinear()
    .domain([
      d3.min(dataset.value, (d) => d3.min(d.sites, (s) => s.escape)),
      d3.max(dataset.value, (d) => d3.max(d.sites, (s) => s.escape)),
    ])
    .range([height - marginBottom, marginTop]);
});

const yAxisGenerator = computed(() => {
  return d3.axisLeft().scale(yScale.value).ticks(6).tickSizeOuter(0);
});

const lineGenerator = computed(() => {
  return d3
    .line()
    .x((d) => xScale.value(d.site))
    .y((d) => yScale.value(d.escape));
});

const points = computed(() => {
  return dataset.value.flatMap((d) =>
    d.sites.map((s) => [xScale.value(s.site), yScale.value(s.escape), d.antibody])
  );
});

let svg;
onMounted(() => {
  svg = d3.select(svgContainer.value).attr('viewBox', `0 0 ${width} ${height}`);
});

//from https://carbondesignsystem.com/data-visualization/color-palettes/
const colorScale = d3
  .scaleOrdinal()
  .range(['#6929C4', '#1192e8', '#005d5d', '#9f1853', '#fa4d56', '#570408']);

function makeColorChart() {
  const path = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .selectAll('path')
    .data(dataset.value)
    .join('path')
    .attr('d', (d) => lineGenerator.value(d.sites))
    .attr('stroke', (d) => colorScale(d.antibody))
    .attr('mix-blend-mode', 'multiply');

  //x-axis
  svg
    .append('g')
    .attr('transform', `translate(0, ${height - marginBottom})`)
    .call(xAxisGenerator.value)
    .attr('font-size', '15px')
    .call((g) => g.selectAll('.domain').remove())
    .call((g) =>
      g //grid lines
        .selectAll('.tick line')
        .clone()
        .attr('y2', -height + marginBottom)
        .attr('stroke-opacity', 0.1)
    )
    .call((g) =>
      g //x-axis title
        .append('text')
        .attr('x', width / 2)
        .attr('y', marginBottom - 20)
        .attr('font-size', '18px')
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Site')
    );

  //y-axis
  svg
    .append('g')
    .attr('transform', `translate(${marginLeft}, 0)`)
    .call(yAxisGenerator.value)
    .attr('font-size', '15px')
    .call((d) => d.selectAll('.domain').remove())
    .call((g) =>
      g //y-axis title
        .append('text')
        .attr('x', -height / 2)
        .attr('y', -marginLeft + 20)
        .attr('font-size', '18px')
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Summed Escape')
    );

  //setup tooltip
  const dot = svg.append('g').attr('display', 'none');

  dot.append('circle').attr('r', 3).attr('fill', 'currentColor');

  dot
    .append('text')
    .attr('font-size', 12)
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .attr('y', -8);

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.leastIndex(points.value, ([x, y]) => Math.hypot(x - xm, y - ym));
    const [x, y, antibody] = points.value[i];
    const { site, escape } = dataset.value
      .find((d) => d.antibody === antibody)
      .sites.find((s) => xScale.value(s.site) === x);

    path
      .style('stroke', ({ antibody: a }) => (a === antibody ? null : '#ddd'))
      .filter(({ antibody: a }) => a === antibody)
      .raise();
    dot.attr('transform', `translate(${x},${y})`);
    dot.select('text').text(`Antibody: ${antibody}, Site: ${site}, Escape: ${escape.toFixed(2)}`);
    svg.property('value', { antibody, site, escape }).dispatch('input', { bubbles: true });
  }

  function pointerentered() {
    path.style('mix-blend-mode', null).style('stroke', '#ddd');
    dot.attr('display', null);
  }

  function pointerleft() {
    path.style('stroke', (d) => colorScale(d.antibody));
    dot.attr('display', 'none');
    svg.node().value = null;
    svg.dispatch('input', { bubbles: true });
  }

  svg
    .on('pointerenter', pointerentered)
    .on('pointermove', pointermoved)
    .on('pointerleave', pointerleft)
    .on('touchstart', (event) => event.preventDefault());
}

watchEffect(() => {
  if (dataset.value) {
    makeColorChart();
  }
});
</script>
