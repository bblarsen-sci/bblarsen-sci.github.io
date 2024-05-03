<template>
<div class="flex flex-col justify-center items-center p-6">
  <div>Heatmap of Mutational Effects on Cell Entry</div>
  <div ref="svgContainer"></div>
  <div class="m-2 text-xs">
    <label for="paddingSelect" class="mr-2">Select Padding:</label>
    <select id="paddingSelect" v-model="paddingValue" class="px-1 py-1 rounded-md align-middle text-center ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500">
        <option value="0">none</option>
        <option value="0.01">thin</option>
        <option value="0.05">medium</option>
        <option value="0.1">large</option>
    </select>
  </div>
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
const siteInputValue = ref('');
const selectedSites = ref([]);
const data = ref(null);

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
  const squareSize = 10;
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
      .attr('stroke-width', strokeWidthValue.value);

    svgElement.selectAll(`.wildtype-row-${rowIndex}`)
      .data(filteredData.filter(d => siteRow.includes(+d.site)))
      .join('text')
      .attr('class', `wildtype-row-${rowIndex}`)
      .attr('x', d => xScale(siteRow.indexOf(+d.site)) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.wildtype) + (yScale.range()[1] + rowPadding) * rowIndex + yScale.bandwidth() / 2 + 3)
      .attr('text-anchor', 'middle')
      .attr('font-size', '6px')
      .attr('font-weight', '100')
      .attr('fill', 'black')
      .text('X');

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

    svgElement.append('g')
      .attr('class', `y-axis-row-${rowIndex}`)
      .attr('transform', `translate(0, ${(yScale.range()[1] + rowPadding) * rowIndex})`)
      .call(d3.axisLeft(yScale).tickSizeOuter(0));


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