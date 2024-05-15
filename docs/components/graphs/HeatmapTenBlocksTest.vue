<template>
  
  <d3PlotContainer class="max-w-2xl">
    <div class="flex flex-row items-center justify-center">
      <label for="easingRef" class="mr-2 font-semibold">Select Enter Easing:</label>
      <select id="easingRef" v-model="easingRef" class="px-6 rounded-md bg-slate-200">
        <option value="easeLinear">easeLinear</option>
        <option value="easeExp">easeExp</option>
        <option value="easeExpInOut">easeExpInOut</option>
        <option value="easePoly">easePoly</option>
        <option value="easeQuad">easeQuad</option>
        <option value="easeCubic">easeCubic</option>
        <option value="easeElastic">easeElastic</option>
        <option value="easeBounce">easeBounce</option>
        <option value="easeElasticInOut">easeElasticInOut</option>
      </select>
      <label for="delayMultiplier" class="mx-2 font-semibold">Select Delay:</label>
      <select id="delayMultiplier" v-model="delayMultiplier" class="px-6 rounded-md bg-slate-200">
        <option value="0">0</option>
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="6">6</option>
      </select>
      <div class="flex flex-col items-center ml-4">
        <input type="checkbox" id="delayByIndex" v-model="delayByIndex" class="mr-2">
        <label for="delayByIndex" class="font-semibold">Delay by Index</label>
        <input type="checkbox" id="delayByRandom" v-model="delayByRandom" class="mt-6">
        <label for="delayByRandom" class="font-semibold">Delay by Random</label>
      </div>
    </div>
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
const easingRef = ref('easeLinear');
const delayMultiplier = ref(0);
const delayByIndex = ref(false);
const delayByRandom = ref(false);
const sitesPerView = 20;

const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const squareSize = 10;
const innerWidth = squareSize * sitesPerView;
const innerHeight = innerWidth
const width = innerWidth + margin.left + margin.right;
const height = innerHeight + margin.top + margin.bottom;
console.log(height,width)
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
    //.attr('width', width)
    //.attr('height', height)
    .attr("viewBox", `0 0 300 300`)
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

function updateHeatmap(svgElement, xScale, yScale) {
  
  const t = svgElement.transition().duration(1000);

  svgElement.selectAll('rect')
    .data(allCombinations.value, d => `${d.site}-${d.mutant}`)
    .join(
      enter => enter.append('rect')
        .attr('fill', d => getFillColor.value(d.site, d.mutant))
        .attr('x', width)
        .attr('y', d => yScale(d.mutant))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .call(enter => enter.transition(t).delay((d, i) => delayByIndex.value ? (delayByRandom.value ? i * +delayMultiplier.value * Math.random() : i * +delayMultiplier.value) : (delayByRandom.value ? Math.random() * +delayMultiplier.value : +delayMultiplier.value)).ease(d3[easingRef.value])
          .attr('x', d => xScale(d.site)),
        ),
        update => update,
        exit => exit
          .call(exit => exit.transition(t).delay((d, i) => delayByIndex.value ? (delayByRandom.value ? i * +delayMultiplier.value * Math.random() : i * +delayMultiplier.value) : (delayByRandom.value ? Math.random() * +delayMultiplier.value : +delayMultiplier.value)).ease(d3.easeBackIn)
            .attr('y', height)
            .attr('fill', 'white')
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
        .attr('fill', 'transparent')
        .attr('x', d => xScale(+d.site) + xScale.bandwidth() * 10)
        .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() /2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '8px')
        .attr('font-weight', '100')
        .text('X')
        .call(enter => enter.transition(t).delay((d, i) => delayByIndex.value ? (delayByRandom.value ? i * +delayMultiplier.value * Math.random() : i * +delayMultiplier.value) : (delayByRandom.value ? Math.random() * +delayMultiplier.value : +delayMultiplier.value)).ease(d3[easingRef.value])
          .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
          .attr('fill', 'black')
        ),
      update => update,
      exit => exit
        .call(exit => exit.transition(t).delay((d, i) => delayByIndex.value ? (delayByRandom.value ? i * +delayMultiplier.value * Math.random() : i * +delayMultiplier.value) : (delayByRandom.value ? Math.random() * +delayMultiplier.value : +delayMultiplier.value)).ease(d3.easeBackIn)
              .attr('y', height)
              .attr('fill', 'white')
              .remove())
    );

  svgElement.select('.x-axis')
    .transition()
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'end')
    .attr('dx', '-7px')
    .attr('dy', '-5px');
}
//Create reactive variables to store the data and loading state
const loaded = ref(false);
// Create a separate async function to fetch and process the data
async function loadData() {
  data.value = await fetchData();
  loaded.value = true;
}
// Call the loadData function immediately
loadData();

onMounted(async () => {
  // Wait for the data to be loaded before creating the chart
  if (!loaded.value) {
    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (loaded.value) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  const svgElement = createSvg();
  createAxes(svgElement, createScales().xScale, createScales().yScale);
  const { xScale, yScale } = createScales();

  updateHeatmap(svgElement, xScale, yScale);

  autoMove();
  watch([currentIndex, easingRef, delayMultiplier, delayByIndex,delayByRandom], () => {
    console.log('watching');
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