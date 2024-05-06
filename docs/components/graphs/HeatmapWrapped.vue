<template>
  <div class="flex flex-col justify-evenly items-center text-center gap-10 font-medium text-sm">
    <div class="">
      <label for="fileInput" class="mr-2">Upload CSV:</label>
      <input type="file" id="fileInput" @change="handleFileUpload" accept=".csv" class="p-1 ring-1 ring-slate-400">
    </div>
    <div class="flex flex-row justify-between gap-10">
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
        <label for="rowsSelect" class="mr-2">Select rows:</label>
        <select id="rowsSelect" v-model="rows" class="p-1 ring-1 ring-slate-400">
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="8">8</option>
        </select>
      </div>
    </div>
    <div class="flex flex-row justify-between gap-10">
      <div class="">
        <label for="cutoffs" class="mr-2">Select color cutoff values:</label>
        <select id="cutoffs" v-model="cutoffs" class="p-1 ring-1 ring-slate-400">
          <option value="1">-1 to 1</option>
          <option value="2">-2 to 2</option>
          <option value="4">-4 to 4</option>
        </select>
      </div>
    </div>
    <div class="flex flex-row align-middle justify-between gap-4">
      <label class=" my-2">Change color:</label>
      <div class="">
        <button @click="changeColorScale('interpolateRdBu')" class="p-2  ring-2 ring-slate-400 rounded-lg  hover:ring-sky-400">Red Blue</button>
      </div>
      <div class="">
        <button @click="changeColorScale('interpolateBrBG')" class="p-2  ring-2 ring-slate-400 rounded-lg  hover:ring-sky-400">Brown Green</button>
      </div>
      <div class="">
        <button @click="changeColorScale('interpolatePRGn')" class="p-2  ring-2 ring-slate-400 rounded-lg  hover:ring-sky-400">Purple Green</button>
      </div>
      <div class="">
        <button @click="changeColorScale('interpolatePiYG')" class="p-2  ring-2 ring-slate-400 rounded-lg  hover:ring-sky-400">Pink Yellow Green</button>
      </div>
    </div>
    <div class="flex flex-row gap-6">
      <div class="pl-4">
        <button @click="downloadSVG" class="p-2  ring-2 ring-slate-400 rounded-lg  hover:ring-sky-400">Download SVG</button>
      </div>
      <div class="">
        <button @click="downloadImage('png')" class="p-2  ring-2 ring-slate-400 rounded-lg  hover:ring-sky-400">Download PNG</button>
      </div>
      <div class="">
        <button @click="downloadImage('jpg')" class="p-2  ring-2 ring-slate-400 rounded-lg  hover:ring-sky-400">Download JPG</button>
      </div>
    </div>
  </div>
  <div class="flex flex-col overflow-visible justify-between gap-4 lg:items-center mt-10 ">
    <div class="py-2">
      <div class="" ref="svgContainer"></div>
    </div>
    <div class="">
      <div class="" ref="legendContainer"></div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, watch, onMounted} from 'vue';
import { saveAs } from 'file-saver';
import * as d3 from 'd3';

// Define constants
const rows = ref(4);
const svgContainer = ref(null);
const paddingValue = ref(0.1);
const strokeWidthValue = ref(0.0);
const selectedAminoAcid = ref('');
const selectedSites = ref([]);
const data = ref(null);
const legendContainer = ref(null);
const uploadedFile = ref(null);
const selectedColorScale = ref('interpolateRdBu');
const cutoffs = ref(4);


const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

watch([paddingValue, strokeWidthValue, selectedAminoAcid, selectedSites, rows, selectedColorScale, cutoffs], () => {
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

function downloadImage(format) {
  const svgElement = document.querySelector('svg');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const svgWidth = svgElement.getAttribute('width');
  const svgHeight = svgElement.getAttribute('height');

  
  canvas.width = (svgWidth * 4) + 20;
  canvas.height = (svgHeight * 4) + 20;

  // Set the canvas background color to white
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.onload = () => {
    // Draw the image on the canvas with double the size for higher resolution
    ctx.drawImage(img, 0, 0, (canvas.width - 20), (canvas.height - 20));

    canvas.toBlob((blob) => {
      saveAs(blob, `heatmap.${format}`);
    }, `image/${format}`);
  };

  img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
}

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
function handleFileUpload(event) {
  uploadedFile.value = event.target.files[0];
  fetchData();
}

function changeColorScale(scale) {
  selectedColorScale.value = scale;
  updateHeatmap(data.value);
}

const margin = { top: 20, right: 20, bottom: 30, left: 50 };
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
  const sitesPerRow = Math.ceil(sites.length / rows.value);
  const siteRows = Array.from({ length: rows.value }, (_, i) =>
    sites.slice(i * sitesPerRow, (i + 1) * sitesPerRow)
  );

  const maxSitesInRow = Math.max(...siteRows.map(row => row.length));
  const squareSize = 9;
  const innerWidth = squareSize * maxSitesInRow;
  const width = innerWidth + margin.left + margin.right;
  const height = squareSize * amino_acids.length * rows.value + margin.top + margin.bottom + rowPadding * (rows.value - 1) + margin.bottom;
  const innerHeight = height - margin.top - margin.bottom;

  const allCombinations = sites.flatMap(site => // Create all combinations of sites and amino acids to fill in gray for sites not found
    amino_acids.map(mutant => ({ site, mutant }))
  );

  // D3 FIGURE MAKING
  const maxAbsValue = Math.abs(cutoffs.value);
  let colorScale = d3.scaleDiverging(d3[selectedColorScale.value])
    .domain([-maxAbsValue, 0, maxAbsValue]);

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
        return colorScale(+dataLookup[key].effect);
      } else {
        return wildtypeLookup[d.site] === d.mutant ? 'white' : 'lightgray';
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', strokeWidthValue.value)
    

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
    .attr('font-family', 'sans-serif')
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

    svgElement.append('text')
      .attr('class', 'x-axis-title')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom-10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .text('Site');
      

    svgElement.append('text')
      .attr('class', 'y-axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .text('Amino Acid');

  //make the legend
  d3.select(legendContainer.value).html('');
  const legendWidth = 300;
  const legendHeight = 60;

  const legend = d3.select(legendContainer.value)
    .append('svg')
    .attr('width', legendWidth)
    .attr('height', legendHeight);

  const legendScale = d3.scaleLinear()
    .domain([-maxAbsValue, maxAbsValue])
    .range([30, legendWidth - 20]);

  const legendAxis = d3.axisBottom(legendScale)
    .tickValues([-maxAbsValue, 0, maxAbsValue])
    .tickFormat(d => d === 0 ? '0' : (d > 0 ? '+' : '-') + d3.format('.0f')(Math.abs(d)))
    .tickSize(5);

  const legendGradient = legend.append('defs')
    .append('linearGradient')
    .attr('id', 'legendGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');

  const numStops = 100;
  const stopDomain = d3.range(-maxAbsValue, maxAbsValue, (2 * maxAbsValue) / (numStops - 1));

  legendGradient.selectAll('stop')
    .data(stopDomain)
    .enter()
    .append('stop')
    .attr('offset', (d, i) => `${(i / (numStops - 1)) * 100}%`)
    .attr('stop-color', d => colorScale(d));

  legend.append('rect')
    .attr('x', 30)
    .attr('y', 30)
    .attr('width', legendWidth-50)
    .attr('height', 10)
    .style('fill', 'url(#legendGradient)');

  legend.append('g')
    .attr('class', 'legend-axis')
    .attr('transform', `translate(0, 40)`)
    .call(legendAxis)
    .selectAll('text')
    .attr('font-size', '12px');

  // Add the legend title
  legend.append('text')
    .attr('class', 'legend-title')
    .attr('x', (legendWidth) / 2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    //.attr('font-size', '14px')
    .text('Effect of mutation on cell entry');
});
};

async function fetchData() {
  if (uploadedFile.value) {
    const file = uploadedFile.value;
    const reader = new FileReader();
    reader.onload = () => {
      const file_text = reader.result;
      const csv = d3.csvParse(file_text);
      data.value = csv;
      updateHeatmap(data.value);
    };
    reader.readAsText(file);
  } else {
    const file = await fetch('/data/default_heatmap.csv');
    const file_text = await file.text();
    const csv = d3.csvParse(file_text);
    data.value = csv;
    updateHeatmap(data.value);

  }
}

onMounted(() => {
    fetchData();
});
</script>

<style>
.legend-title {
  font-weight: bold;
  font-size: 14px;
  color: black; /* Default color for light mode */
}

@media (isDarkMode: true) {
  .legend-title {
    color: white; /* Color for dark mode */
  }
}
</style>