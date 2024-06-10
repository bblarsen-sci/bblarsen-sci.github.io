<template>
  <svg ref="svgContainer"></svg>
</template>

<script setup>
import { ref, watch, onUnmounted, computed, onMounted } from 'vue';
import * as d3 from 'd3';
import { Legend } from '/components/utilities/legend.js';
import { useFetch } from '/components/composables/useFetch.js';

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

const svgContainer = ref(null);

const currentIndex = ref(0);
const easingRef = 'easeCubicInOut';
const delayByIndex = 5;
const sitesPerView = 20;
const minColor = -4;
const maxColor = 2;
let intervalId;
let svg;
let allSites;
let totalPages;

const { data, error } = useFetch(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv'
);

watch(error, (newError) => {
  if (newError) {
    console.error('Error fetching data:', newError);
  }
});

const height = 300;
const margin = { top: 10, right: 40, bottom: 100, left: 40 };
const innerHeight = height - margin.top - margin.bottom;
const squareSize = Math.min(innerHeight / amino_acids.length, 20); // Define the square size based on the height and number of amino acids
const innerWidth = squareSize * sitesPerView; // Define the inner width based on the square size and number of visible sites
const width = innerWidth + margin.left + margin.right; // Define the total width based on the inner width and margins


watch(data, (newData) => {
  if (newData) {
    allSites = Array.from(new Set(newData.map((d) => +d.site)));
    const totalSites = allSites.length;
    totalPages = Math.ceil(totalSites / sitesPerView);
    updateHeatmap();
  }
});

const visibleSites = computed(() => {
  return allSites.slice(currentIndex.value * sitesPerView, (currentIndex.value + 1) * sitesPerView);
});

const allCombinations = computed(() => {
  return visibleSites.value.flatMap((site) => amino_acids.map((mutant) => ({ site, mutant })));
});

const filteredData = computed(() => {
  return data.value.filter((d) => visibleSites.value.includes(+d.site));
});

const colorScale = d3.scaleDiverging(d3.interpolateRdBu).domain([minColor, 0, maxColor]);

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

const getFillColor = computed(() => {
  return (site, mutant) => {
    const key = `${site}-${mutant}`;
    if (dataLookup.value[key]) {
      return colorScale(+dataLookup.value[key].entry_CHO_bEFNB2);
    } else {
      return wildtypeLookup.value[site] === mutant ? 'white' : 'lightgray';
    }
  };
});

const yScale = d3.scaleBand().domain(amino_acids).range([0, innerHeight]).padding(0.1);

const xScale = computed(() => {
  return d3.scaleBand().domain(visibleSites.value).range([0, innerWidth]).padding(0.1);
});

onMounted(() => {
  svg = d3
    .select(svgContainer.value)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  //make ticks for x-axis
  const xAxisGroup = svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`);

  //make title for x-axis
  svg.append('g').call((d) =>
    d
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', height - margin.bottom + 35)
      .attr('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .attr('font-size', '13px')
      .text('Site')
  );

  // Create the y-axis group and store it in a variable
  const yAxisGroup = svg.append('g').attr('class', 'y-axis');

  yAxisGroup
    .call(d3.axisLeft(yScale).tickSizeOuter(0))
    .attr('font-size', '11px')
    .call((d) => d.select('.domain').remove())
    .call((d) =>
      d
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -margin.left)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', '13px')
        .text('Amino Acid')
    );

  Legend(d3.scaleDiverging([minColor, 0, maxColor], d3.interpolateRdBu), {
    svgRef: svgContainer.value,
    title: 'Cell Entry',
    width: 150,
    tickValues: [minColor, 0, maxColor],
    xcoord: innerWidth - 70,
    ycoord: innerHeight + 60,
    fontSize: 12,
  });
});

function updateHeatmap() {
  intervalId = currentIndex.value = (currentIndex.value + 1) % totalPages;

  const gx = svg
    .select('.x-axis')
    .call(d3.axisBottom(xScale.value).tickSizeOuter(0))
    .attr('transform', `translate(1000,${innerHeight})`)
    .attr('font-size', '11px')
    .call((d) => d.select('.domain').remove());

  gx.transition()
    .duration(1000)
    .delay((d, i) => i * delayByIndex * Math.random())
    .ease(d3[easingRef])
    .ease(d3.easeCubicInOut)
    .attr('transform', `translate(0,${innerHeight})`)
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'middle')
    .attr('dy', '-0.7em')
    .attr('dx', '-0.7em');

  svg
    .selectAll('rect')
    .data(allCombinations.value, (d) => `${d.site}-${d.mutant}`)
    .join(
      (enter) =>
        enter
          .append('rect')
          .attr('fill', (d) => getFillColor.value(d.site, d.mutant))
          .attr('opacity', 0)
          .attr('x', width)
          .attr('y', (d) => yScale(d.mutant))
          .attr('width', xScale.value.bandwidth())
          .attr('height', yScale.bandwidth())
          .transition()
          .duration(1000)
          .delay((d, i) => i * delayByIndex * Math.random())
          .ease(d3[easingRef])
          .attr('x', (d) => xScale.value(d.site))
          .attr('opacity', 1),
      (update) => update,
      (exit) => exit
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .remove());

  const uniqueWildtypes = new Map();
  filteredData.value.forEach((d) => {
    if (!uniqueWildtypes.has(+d.site)) {
      uniqueWildtypes.set(+d.site, d);
    }
  });

  svg
    .selectAll('.wildtype')
    .data(Array.from(uniqueWildtypes.values()), (d) => d.site)
    .join(
      (enter) =>
        enter
          .append('text')
          .attr('class', 'wildtype')
          .attr('x', (d) => xScale.value(+d.site) + xScale.value.bandwidth() * 10)
          .attr('y', (d) => yScale(d.wildtype) + yScale.bandwidth() / 2)
          .attr('text-anchor', 'middle')
          .attr('opacity', 0)
          .attr('dominant-baseline', 'middle')
          .attr('dy', '0.05em')
          .attr('font-size', '10px')
          .text('X')
          .transition()
          .duration(1000)
          .delay((d, i) => i * delayByIndex * Math.random())
          .ease(d3[easingRef])
          .attr('x', (d) => xScale.value(+d.site) + xScale.value.bandwidth() / 2)
          .attr('fill', 'black')
          .attr('opacity', 1),
      (update) => update,
      (exit) => exit
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .remove());

  setTimeout(() => {
    updateHeatmap();
  }, 5000);
}

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
