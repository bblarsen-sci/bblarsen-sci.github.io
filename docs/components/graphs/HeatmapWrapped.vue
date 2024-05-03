<template>
<div class="pt-4 ">
  <div class="font-sans text-2xl font-semibold text-center py-4">Heatmap of Mutational Effects on Cell Entry</div>
  <div class="flex items-center justify-center">
    <div class="" ref="svgContainer"></div>
  </div>
  <div class="flex justify-center my-12">
    <div ref="legendContainer"></div>
  </div>
</div>
<div class="flex flex-row justify-evenly items-center text-center pb-6 font-medium text-sm">
  <div class="">
    <label for="paddingSelect" class="mr-2">Select Padding:</label>
    <select id="paddingSelect" v-model="paddingValue" class="p-1 ring-1 ring-slate-400">
      <option class="" value="0">none</option>
      <option value="0.01">thin</option>
      <option value="0.05">medium</option>
      <option value="0.1">large</option>
    </select>
  </div>
  <div class="">
    <label for="strokeSelect" class="mr-2">Select Stroke Size:</label>
    <select id="strokeSelect" v-model="strokeWidthValue" class="p-1 ring-1 ring-slate-400">
      <option value="0">0</option>
      <option value="0.25">0.25</option>
      <option value="0.5">0.5</option>
      <option value="1.0">1.0</option>
    </select>
  </div>
  <div class="">
    <button @click="downloadSVG" class="p-2 bg-sky-600 shadow-md shadow-sky-600 text-white rounded-full hover:ring-2 ring-sky-800">Download SVG</button>
  </div>
</div>
<div class="relative inline-block text-center">
    <div ref="tooltip" id="tooltip" class="bg-black/80 opacity-90 shadow-md shadow-black whitespace-nowrap text-white absolute rounded-md p-2 text-sm"></div>
</div>
</template>

<script setup>
import { ref, watch, onMounted} from 'vue';
import * as d3 from 'd3';

// Define constants
const svgContainer = ref(null);
const paddingValue = ref(0.1);
const strokeWidthValue = ref(0.0);
const selectedAminoAcid = ref('');
const selectedSites = ref([]);
const data = ref(null);
const legendContainer = ref(null);

const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

watch([paddingValue, strokeWidthValue, selectedAminoAcid, selectedSites], () => {
  updateHeatmap(data.value);
});

// Define functions
function parseSites(input) {
  const ranges = input.split(',').map(s => s.trim());
  let sites = [];
  ranges.forEach(range => {
      if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          sites = sites.concat(Array.from({ length: end - start + 1 }, (_, i) => start + i));
      } else {
          sites.push(Number(range));
      }
  });
  return sites;
};

function downloadSVG() {
    const svgElement = document.querySelector('svg'); 
    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svgElement)], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'heatmap.svg'; 
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink); 
    URL.revokeObjectURL(url); 
};


const rows=4;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const rowPadding = 30;


function updateHeatmap(data) {
  let filteredData = data; // assign data to filtered data, otherwise it gets overwritten when filtering
  
  // functions for filtering the data
  if (selectedSites.value.length > 1) {
    filteredData = filteredData.filter(d => selectedSites.value.includes(+d.site));
  }
  if (selectedAminoAcid.value) {
    filteredData = filteredData.filter(d => d.wildtype === selectedAminoAcid.value);
  } 

  const sites = Array.from(new Set(filteredData.map(d => +d.site)));
  const sitesPerRow = Math.ceil(sites.length / rows);
  const siteRows = Array.from({ length: rows }, (_, i) =>
    sites.slice(i * sitesPerRow, (i + 1) * sitesPerRow)
  );

  const maxSitesInRow = Math.max(...siteRows.map(row => row.length));
  const squareSize = 11;
  const innerWidth = squareSize * maxSitesInRow;
  const width = innerWidth + margin.left + margin.right;
  const height = squareSize * amino_acids.length * rows + margin.top + margin.bottom + rowPadding * (rows - 1) + margin.bottom;
  const innerHeight = height - margin.top - margin.bottom;

  const allCombinations = sites.flatMap(site => // Create all combinations of sites and amino acids to fill in gray for sites not found
    amino_acids.map(mutant => ({ site, mutant }))
  );

  
  // D3 FIGURE MAKING
  let colorScale = d3.scaleDiverging(d3.interpolateRdBu) // Use a diverging color scale
    .domain([-4, 0, 4]);

  // setup the scales
  const yScale = d3.scaleBand()
    .domain(amino_acids)
    .range([0, squareSize * amino_acids.length])
    .padding(paddingValue.value);

  const xScale = d3.scaleBand()
    .domain(Array.from({ length: maxSitesInRow }, (_, i) => i))
    .range([0, innerWidth])
    .padding(paddingValue.value);
    
  const svg = d3.select(svgContainer.value); // Select the SVG container
  svg.html(''); // Remove all existing elements in the SVG

  const svgElement = svg.append('svg') // Append a new SVG element
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // This code creates a lookup table for the data, so we can easily find the data for a specific site and amino acid and vastly improves performance.
  const dataLookup = filteredData.reduce((lookup, dataPoint) => {
    lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
    return lookup;
  }, {});

  const wildtypeLookup = filteredData.reduce((lookup, dataPoint) => {
    lookup[dataPoint.site] = dataPoint.wildtype;
    return lookup;
  }, {});
    
  //Plot rectangles
  siteRows.forEach((siteRow, rowIndex) => {
  svgElement.selectAll(`rect-row-${rowIndex}`)
    .data(siteRow.flatMap(site => amino_acids.map(mutant => ({ site, mutant }))))
    .join('rect')
    .attr('x', d => xScale(siteRow.indexOf(d.site)))
    .attr('y', d => yScale(d.mutant) + (yScale.range()[1] + rowPadding) * rowIndex)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => {
      const key = `${d.site}-${d.mutant}`;
      if (dataLookup[key]) {
        return colorScale(+dataLookup[key].entry_CHO_bEFNB2);
      } else {
        return wildtypeLookup[d.site] === d.mutant ? 'white' : 'lightgray';
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', strokeWidthValue.value)
    .on('mouseover', function(event, d) {
    const dataPoint = filteredData.find(dp => +dp.site === d.site && dp.mutant === d.mutant);
    let tooltipText = '';
    if (dataPoint) {
      tooltipText = `<div>${d.site} ${d.mutant}</div>Entry: ${parseFloat(dataPoint.entry_CHO_bEFNB2).toFixed(2)}`
    } else {
      const wildtypePoint = filteredData.find(dp => +dp.site === d.site && dp.wildtype === d.mutant);
      if (wildtypePoint) {
        tooltipText = `<div>${d.site}</div>Wildtype: ${d.mutant}`;
      } else {
        tooltipText = `<div>${d.site} ${d.mutant}</div> Value: Missing`;
      }
    }
    const tooltip = d3.select('#tooltip');
    tooltip.html(tooltipText)
    .style('opacity', 1)
    .style('transform', `translate(${event.offsetX - margin.left + 175 }px, ${event.offsetY - height - 270}px)`)
  })
  .on('mouseout', function() {
    const tooltip = d3.select('#tooltip');
    tooltip.style('opacity', 0)
      .style('transform', 'none');
  });

  // Add the wildtype 'X' text to the boxes
  svgElement.selectAll(`.wildtype-row-${rowIndex}`)
    .data(filteredData.filter(d => siteRow.includes(+d.site)))
    .join('text')
    .attr('class', `wildtype-row-${rowIndex}`)
    .attr('x', d => xScale(siteRow.indexOf(+d.site)) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.wildtype) + (yScale.range()[1] + rowPadding) * rowIndex + yScale.bandwidth() / 2 + 3)
    .attr('text-anchor', 'middle')
    .attr('font-size', '8px')
    .attr('font-weight', '100')
    .attr('fill', 'black')
    .text('X');

  // Add the site numbers to the x-axis, only plotting every 10 sites
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  if (siteRow.length <= 50) {
    xAxis.tickFormat(d => siteRow[d]);
  } else {
    xAxis.tickFormat((d, i) => i % 10 === 0 ? siteRow[d] : '');
  }

  svgElement.append('g')
    .attr('class', `x-axis-row-${rowIndex}`)
    .attr('transform', `translate(0, ${(yScale.range()[1] + rowPadding) * rowIndex + yScale.range()[1]})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'end')
    .attr('dx', '-7px')
    .attr('dy', '-5px');

  // Add the amino acids to the y-axis
  svgElement.append('g')
    .attr('class', `y-axis-row-${rowIndex}`)
    .attr('transform', `translate(0, ${(yScale.range()[1] + rowPadding) * rowIndex})`)
    .call(d3.axisLeft(yScale).tickSizeOuter(0));


  //make the legend
  d3.select(legendContainer.value).html('');
  const legendWidth = 250;
  const legendHeight = 60;

  const legend = d3.select(legendContainer.value)
    .append('svg')
    .attr('width', legendWidth)
    .attr('height', legendHeight);

  const legendScale = d3.scaleLinear()
    .domain([-4, 4])
    .range([0, legendWidth - 20 ]);

  const legendAxis = d3.axisBottom(legendScale)
    .ticks(5)
    .tickFormat(d3.format('.0f'))
    .tickSize(5);

  const legendGradient = legend.append('defs')
    .append('linearGradient')
    .attr('id', 'legendGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');

  const numStops = 100;
  const stopDomain = d3.range(-4, 4, 8 / (numStops - 1));

  legendGradient.selectAll('stop')
    .data(stopDomain)
    .enter()
    .append('stop')
    .attr('offset', (d, i) => `${(i / (numStops - 1)) * 100}%`)
    .attr('stop-color', d => colorScale(d));

  legend.append('rect')
    .attr('x', 0)
    .attr('y', 30)
    .attr('width', legendWidth-20)
    .attr('height', 10)
    .style('fill', 'url(#legendGradient)');

  legend.append('g')
    .attr('class', 'legend-axis')
    .attr('transform', `translate(0, 40)`)
    .call(legendAxis)
    .selectAll('text')
    .attr('font-size', '10px');

  // Add the legend title
  legend.append('text')
    .attr('class', 'legend-title')
    .attr('x', (legendWidth-20) / 2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    //.attr('font-weight', 'bold')
    .text('Cell Entry Effect');
});
};

async function fetchData() {
    const file = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv');
    const file_text = await file.text();
    const csv = d3.csvParse(file_text);
    data.value = csv;
    updateHeatmap(data.value);
};

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
</style>