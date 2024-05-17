<template>
    <div ref="svgContainer" class="flex flex-col justify-center items-center"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import * as d3 from 'd3';

const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

const svgContainer = ref(null);
const data = ref(null);
const currentIndex = ref(0);
const easingRef = ref('easeCubic');
const delayMultiplier = ref(5);
const delayByIndex = ref(true);
const delayByRandom = ref(true);
const sitesPerView = 20;

const height = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const innerHeight = height - margin.top - margin.bottom;
const squareSize = Math.min(innerHeight / amino_acids.length, 20); // Define the square size based on the height and number of amino acids
const innerWidth = squareSize * sitesPerView; // Define the inner width based on the square size and number of visible sites
const width = innerWidth + margin.left + margin.right; // Define the total width based on the inner width and margins

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

const allCombinations = computed(() => {
  return visibleSites.value.flatMap(site => amino_acids.map(mutant => ({ site, mutant })));
});

const filteredData = computed(() => {
  return data.value.filter(d => visibleSites.value.includes(+d.site));
});

const getFillColor = computed(() => {
  return (site, mutant) => {
    const key = `${site}-${mutant}`;
    if (dataLookup.value[key]) {
      return colorScale.value(+dataLookup.value[key].entry_CHO_bEFNB2);
    } else {
      return wildtypeLookup.value[site] === mutant ? 'white' : 'lightgray';
    }
  };
});

function autoMove() {
  const totalSites = allSites.value.length;
  const totalPages = Math.ceil(totalSites / sitesPerView);
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % totalPages;
  }, 5000);
}

function createSvg() {
  const svgElement = d3.select(svgContainer.value).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left + (width - margin.left - margin.right - innerWidth) / 2}, ${margin.top})`);
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
    .attr('class', 'x-axis-label')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .call(d => d.select(".domain").remove())
    .call(d => d.selectAll("text")
      .attr("transform", "rotate(-90)")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .style("text-anchor", "end")
    )
  svgElement.append('g')
    .call(d => d.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', margin.bottom + 235 )
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('font-size', '10px')
      .text('Site')
    );
    
  svgElement.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).tickSizeOuter(0))
    .call(d => d.select(".domain").remove())
    .call(d => d.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .text('Amino Acid')
    );
}

function updateHeatmap(svgElement, xScale, yScale) {

  const t = svgElement.transition().duration(750);

  svgElement.selectAll('rect')
    .data(allCombinations.value, d => `${d.site}-${d.mutant}`)
    .join(
      enter => enter.append('rect')
        .attr('fill', d => getFillColor.value(d.site, d.mutant))
        .attr('opacity', 1)
        .attr('x', width)
        .attr('y', d => yScale(d.mutant))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .call(enter => enter.transition(t).delay((d, i) => i * delayByIndex.value * Math.random()).ease(d3[easingRef.value])
          .attr('x', d => xScale(d.site)),
        ),
      update => update,
      exit => exit
        .call(exit => exit.transition(t).delay((d, i) => i * 1).ease(d3.easeLinear)
          .attr('y', height)
          //.attr('fill', 'white')
          .attr('opacity', 0)
          .remove())
    )


  const uniqueWildtypes = new Map();
  filteredData.value.forEach(d => {
    if (!uniqueWildtypes.has(+d.site)) {
      uniqueWildtypes.set(+d.site, d);
    }
  });

  svgElement.selectAll('.wildtype')
    .data(Array.from(uniqueWildtypes.values()), d => d.site)
    .join(
      enter => enter.append('text')
        .attr('class', 'wildtype')
        //.attr('fill', 'transparent')
        .attr('x', d => xScale(+d.site) + xScale.bandwidth() * 10)
        .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .attr('dominant-baseline', 'middle')
        .attr('dy', '0.05em')
        .attr('font-size', '10px')
        .attr('font-weight', '100')
        .text('X')
        .call(enter => enter.transition(t).delay((d, i) => i * delayByIndex.value * Math.random()).ease(d3[easingRef.value])
          .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
          .attr('fill', 'black')
          .attr('opacity', 1)
        ),
      update => update,
      exit => exit
          .call(exit => exit.transition(t).delay((d, i) => i * 1).ease(d3.easeLinear)
          .attr('y', height)
          .attr('opacity', 0)
          .remove())
    );

  svgElement.select('.x-axis-label')
    .transition()
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
  const { xScale, yScale } = createScales();
  createAxes(svgElement, xScale, yScale);
  updateHeatmap(svgElement, xScale, yScale);
  autoMove();

  watch([visibleSites], () => {
    const { xScale, yScale } = createScales();
    updateHeatmap(svgElement, xScale, yScale);
  });
});

async function fetchData() {
  console.log('fetching data')
  const file = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv');
  const file_text = await file.text();
  const csv = d3.csvParse(file_text);
  return csv;
}
</script>