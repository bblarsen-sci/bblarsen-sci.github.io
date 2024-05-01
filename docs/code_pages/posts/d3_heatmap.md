---
title: D3 Heatmap
aside: false
date: 2024-04-30
keywords:
    - D3
    - Heatmap
subtext: How to make a heatmap from deep mutational scanning data using D3, adding some interactivity. This heatmap shows the effect of receptor binding protein mutations on cell entry in CHO-bEFNB2 cells. The 'X' represents the unmutated amino acid.
---

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

<html>
<body>
<div class=" m-2 text-xl font-semibold">Heatmap of mutational effects</div>
<div class="flex flex-col justify-left items-left">
  <div class="m-2 text-xs">
      <label for="siteInput">Enter Specific Sites:</label>
      <input type="text" id="siteInput" class="mx-2 px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 555-560, 590-600">
      <button id="updateSites" class="ml-2 px-4 py-2 bg-indigo-500 shadow-md shadow-indigo-500 text-white rounded-xl">Update</button>
  </div>
  <div class="m-2 text-xs">
    <label for="paddingSelect" class="mr-2">Select Padding:</label>
    <select id="paddingSelect" class="px-1 py-1 rounded-md align-middle text-center ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <option value="0.01">thin</option>
      <option value="0.05">medium</option>
      <option value="0.1">large</option>
    </select>
  </div>
  <div class="m-2 text-xs">
    <label for="strokeSelect" class="mr-2">Select Stroke Size:</label>
    <select id="strokeSelect" class="px-1 py-1 align-middle text-center rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <option value="0">0</option>
      <option value="0.25">0.25</option>
      <option value="0.5">0.5</option>
      <option value="1.0">1.0</option>
    </select>
  </div>
    <div class="m-2 text-xs">
        <label for="wildtypeSelect" class="mr-2">Select Wildtype Amino Acid:</label>
        <select id="wildtypeSelect" class="px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All</option>
            <option value="R">R</option>
            <option value="K">K</option>
            <option value="H">H</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="Q">Q</option>
            <option value="N">N</option>
            <option value="S">S</option>
            <option value="T">T</option>
            <option value="Y">Y</option>
            <option value="W">W</option>
            <option value="F">F</option>
            <option value="A">A</option>
            <option value="I">I</option>
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="V">V</option>
            <option value="G">G</option>
            <option value="P">P</option>
            <option value="C">C</option>
        </select>
    </div>
    <div ref="svgContainer" id="svgContainer"></div>
</div>
<div ref="tooltip" id="tooltip" class="tooltip"></div>
<div class="ml-2 text-xs mt-10">
    <button id="downloadSVG" class="px-4 py-2 bg-indigo-500 shadow-md shadow-indigo-500 text-white rounded-lg">Download SVG</button>
</div>
</body>
</html>

## Making the heatmap
I like the usefullness of heatmaps in Altair, but the code can be pretty complicated, and was always frustrated how 'one-way' the process felt. Sure, you can make it interactive, and apply filters, but its difficult to manipulate the heatmap once you embed it in a browser. I wanted to figure out how to make a heatmap in D3. 


I am going to break this into three steps. First, the html that vue interacts with. Next, the javascript code to get everything formatted correctly, and finally, the d3 code to make the heatmap itself. 

## HTML

```html
<html>
<body>
<div class=" m-2 text-xl font-semibold">Heatmap of mutational effects</div>
<div class="flex flex-col justify-left items-left">
  <div class="m-2 text-xs">
      <label for="siteInput">Enter Specific Sites:</label>
      <input type="text" id="siteInput" class="mx-2 px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 555-560, 590-600">
      <button id="updateSites" class="ml-2 px-4 py-2 bg-indigo-500 shadow-md shadow-indigo-500 text-white rounded-xl">Update</button>
  </div>
  <div class="m-2 text-xs">
    <label for="paddingSelect" class="mr-2">Select Padding:</label>
    <select id="paddingSelect" class="px-1 py-1 rounded-md align-middle text-center ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <option value="0.01">thin</option>
      <option value="0.05">medium</option>
      <option value="0.1">large</option>
    </select>
  </div>
  <div class="m-2 text-xs">
    <label for="strokeSelect" class="mr-2">Select Stroke Size:</label>
    <select id="strokeSelect" class="px-1 py-1 align-middle text-center rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <option value="0">0</option>
      <option value="0.25">0.25</option>
      <option value="0.5">0.5</option>
      <option value="1.0">1.0</option>
    </select>
  </div>
  <div class="m-2 text-xs">
    <label for="wildtypeSelect" class="mr-2">Select Wildtype Amino Acid:</label>
    <select id="wildtypeSelect" class="px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All</option>
        <option value="R">R</option>
        <option value="K">K</option>
        <option value="H">H</option>
        <option value="D">D</option>
        <option value="E">E</option>
        <option value="Q">Q</option>
        <option value="N">N</option>
        <option value="S">S</option>
        <option value="T">T</option>
        <option value="Y">Y</option>
        <option value="W">W</option>
        <option value="F">F</option>
        <option value="A">A</option>
        <option value="I">I</option>
        <option value="L">L</option>
        <option value="M">M</option>
        <option value="V">V</option>
        <option value="G">G</option>
        <option value="P">P</option>
        <option value="C">C</option>
    </select>
  </div>
  <div ref="svgContainer" id="svgContainer"></div>
</div>
<div class="ml-2 text-xs mt-10">
    <button id="downloadSVG" class="px-4 py-2 bg-indigo-500 shadow-md shadow-indigo-500 text-white rounded-lg">Download SVG</button>
</div>
</body>
</html>
```
I will break this down further. The first section contains code to enter in sites of your choosing:
```html
<div class="m-2 text-xs">
    <label for="siteInput">Enter Specific Sites:</label>
    <input type="text" id="siteInput" class="mx-2 px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 555-560, 590-600">
    <button id="updateSites" class="ml-2 px-4 py-2 bg-indigo-500 shadow-md shadow-indigo-500 text-white rounded-xl">Update</button>
</div>
```
The second section has the padding selection:

```html
<div class="m-2 text-xs">
    <label for="paddingSelect" class="mr-2">Select Padding:</label>
    <select id="paddingSelect" class="px-1 py-1 rounded-md align-middle text-center ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <option value="0.01">thin</option>
      <option value="0.05">medium</option>
      <option value="0.1">large</option>
    </select>
  </div>
```
The third section has the selections for choosing different strokes:

```html
<div class="m-2 text-xs">
  <label for="strokeSelect" class="mr-2">Select Stroke Size:</label>
  <select id="strokeSelect" class="px-1 py-1 align-middle text-center rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
    <option value="0">0</option>
    <option value="0.25">0.25</option>
    <option value="0.5">0.5</option>
    <option value="1.0">1.0</option>
  </select>
</div>
```

Next section are sorting the heatmap by individual amino acids. Probably should use ```v-for``` to fill in the amino acids dynamically, might do that on next update. 

```html
<div class="m-2 text-xs">
  <label for="wildtypeSelect" class="mr-2">Select Wildtype Amino Acid:</label>
  <select id="wildtypeSelect" class="px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <option value="">All</option>
      <option value="R">R</option>
      <option value="K">K</option>
      <option value="H">H</option>
      <option value="D">D</option>
      <option value="E">E</option>
      <option value="Q">Q</option>
      <option value="N">N</option>
      <option value="S">S</option>
      <option value="T">T</option>
      <option value="Y">Y</option>
      <option value="W">W</option>
      <option value="F">F</option>
      <option value="A">A</option>
      <option value="I">I</option>
      <option value="L">L</option>
      <option value="M">M</option>
      <option value="V">V</option>
      <option value="G">G</option>
      <option value="P">P</option>
      <option value="C">C</option>
  </select>
</div>
```
And the final section contains the holders for the actual plot, and the button to download an .svg of the current image. 

```html
<div ref="svgContainer" id="svgContainer"></div>
</div>
<div class="ml-2 text-xs mt-10">
    <button id="downloadSVG" class="px-4 py-2 bg-indigo-500 shadow-md shadow-indigo-500 text-white rounded-lg">Download SVG</button>
</div>
```

## Javascript and preparing data for D3

```js
<script setup>
import { ref, computed, onMounted } from 'vue';
import * as d3 from 'd3';
```
Setup the vue holders and the order of the amino acids that we want to appear on the y-axis.

```js
const svgContainer = ref(null);
const tooltip = ref(null);
const padding = ref(0.01);
const strokeWidth = ref(0);

const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];
```
I have a function to parse the data we type in the input box. 

```js
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
}
```
Loading the data.

```js
onMounted(async () => {
const response = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv');
const data = await response.text();
const parsedData = d3.csvParse(data);
let filteredData = parsedData;
```
Setting up dynamic updates of the heatmap.

```js
d3.select('#paddingSelect').on('change', function() {
    padding.value = this.value;
    updateHeatmap();
});
d3.select('#strokeSelect').on('change', function() {
    strokeWidth.value = this.value;
    updateHeatmap();
});
d3.select('#updateSites').on('click', function() {
    const siteInput = document.getElementById('siteInput').value;
    const selectedSites = parseSites(siteInput);
    filteredData = parsedData.filter(d => selectedSites.includes(+d.site));
    updateHeatmap();
});
d3.select('#wildtypeSelect').on('change', function() {
  const selectedAminoAcid = this.value;
  if (selectedAminoAcid) {
    filteredData = parsedData.filter(d => d.wildtype === selectedAminoAcid);
  } else {
    filteredData = parsedData.filter(d => +d.site >= 71 && +d.site <= 602);
  }
  updateHeatmap();
});
d3.select('#downloadSVG').on('click', function() {
    downloadSVG();
});
```
Downloading an .svg file of the current view. 

```js
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
}
```
## D3 plotting of heatmap

Finally, the function updateHeatmap, which is run each time there is an update and plots the heatmap.

```js
function updateHeatmap() {
  const svg = d3.select('#svgContainer');
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerHeight = height - margin.top - margin.bottom;
  

  const sites = [...new Set(filteredData.map(d => +d.site))];
  const squareSize = Math.min(innerHeight / amino_acids.length, 20);
  const innerWidth = squareSize * sites.length;
  const width = innerWidth + margin.left + margin.right;
  
  let colorScale = d3.scaleDiverging(d3.interpolateRdBu)
    .domain([-4, 0, 4]);

  const yScale = d3.scaleBand()
  .domain(amino_acids)
  .range([0, innerHeight])
  .padding(padding.value);

  const xScale = d3.scaleBand()
    .domain(sites)
    .range([0, innerWidth])
    .padding(padding.value);

  svg.selectAll('*').remove();

  const svgElement = svg.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ${width} ${height}')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const allCombinations = sites.flatMap(site =>
    amino_acids.map(mutant => ({ site, mutant }))
  );

  svgElement.selectAll('rect')
    .data(allCombinations)
    .join('rect')
    .attr('x', d => xScale(d.site))
    .attr('y', d => yScale(d.mutant))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => {
      const dataPoint = filteredData.find(dp => +dp.site === d.site && dp.mutant === d.mutant);
      if (dataPoint) {
        return colorScale(+dataPoint.entry_CHO_bEFNB2);
      } else {
        const wildtypePoint = filteredData.find(dp => +dp.site === d.site && dp.wildtype === d.mutant);
        return wildtypePoint ? 'white' : 'lightgray';
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', strokeWidth.value);

  svgElement.selectAll('.wildtype')
    .data(filteredData)
    .join('text')
    .attr('class', 'wildtype')
    .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() / 2 + 3)
    .attr('text-anchor', 'middle')
    .attr('font-size', '8px')
    .attr('font-weight', '100')
    .attr('fill', 'black')
    //.attr('font-family','Helvetica, Arial, sans-serif')
    .text('X');

  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  if (sites.length <= 50) {
    xAxis.tickFormat(d => d);
  } else {
    xAxis.tickFormat((d, i) => i % 10 === 0 ? d : '');
  }

  svgElement.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'end')
    .attr('dx', '-7px')
    .attr('dy', '-5px');

  svgElement.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).tickSizeOuter(0));
    const defs = svgElement.append('defs');
}
updateHeatmap();
});
</script>
```

<script setup>
import { ref, computed, onMounted } from 'vue';
import * as d3 from 'd3';

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
}


const svgContainer = ref(null);
const tooltip = ref(null);
const padding = ref(0.01);
const strokeWidth = ref(0);

const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];


onMounted(async () => {
const response = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv');
const data = await response.text();
const parsedData = d3.csvParse(data);
let filteredData = parsedData;

d3.select('#paddingSelect').on('change', function() {
    padding.value = this.value;
    updateHeatmap();
});
d3.select('#strokeSelect').on('change', function() {
    strokeWidth.value = this.value;
    updateHeatmap();
});
d3.select('#updateSites').on('click', function() {
    const siteInput = document.getElementById('siteInput').value;
    const selectedSites = parseSites(siteInput);
    filteredData = parsedData.filter(d => selectedSites.includes(+d.site));
    updateHeatmap();
});
d3.select('#wildtypeSelect').on('change', function() {
  const selectedAminoAcid = this.value;
  if (selectedAminoAcid) {
    filteredData = parsedData.filter(d => d.wildtype === selectedAminoAcid);
  } else {
    filteredData = parsedData.filter(d => +d.site >= 71 && +d.site <= 602);
  }
  updateHeatmap();
});
d3.select('#downloadSVG').on('click', function() {
    downloadSVG();
});
function downloadSVG() {
    const svgElement = document.querySelector('svg'); // Get the SVG element
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
}



function updateHeatmap() {
  const svg = d3.select('#svgContainer');
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerHeight = height - margin.top - margin.bottom;
  

  const sites = [...new Set(filteredData.map(d => +d.site))];
  const squareSize = Math.min(innerHeight / amino_acids.length, 20);
  const innerWidth = squareSize * sites.length;
  const width = innerWidth + margin.left + margin.right;
  
  let colorScale = d3.scaleDiverging(d3.interpolateRdBu)
    .domain([-4, 0, 4]);

  const yScale = d3.scaleBand()
  .domain(amino_acids)
  .range([0, innerHeight])
  .padding(padding.value);

  const xScale = d3.scaleBand()
    .domain(sites)
    .range([0, innerWidth])
    .padding(padding.value);

  svg.selectAll('*').remove();

  const svgElement = svg.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 ${width} ${height}')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const allCombinations = sites.flatMap(site =>
    amino_acids.map(mutant => ({ site, mutant }))
  );

  svgElement.selectAll('rect')
    .data(allCombinations)
    .join('rect')
    .attr('x', d => xScale(d.site))
    .attr('y', d => yScale(d.mutant))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => {
      const dataPoint = filteredData.find(dp => +dp.site === d.site && dp.mutant === d.mutant);
      if (dataPoint) {
        return colorScale(+dataPoint.entry_CHO_bEFNB2);
      } else {
        const wildtypePoint = filteredData.find(dp => +dp.site === d.site && dp.wildtype === d.mutant);
        return wildtypePoint ? 'white' : 'lightgray';
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', strokeWidth.value);

  svgElement.selectAll('.wildtype')
    .data(filteredData)
    .join('text')
    .attr('class', 'wildtype')
    .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() / 2 + 3)
    .attr('text-anchor', 'middle')
    .attr('font-size', '8px')
    .attr('font-weight', '100')
    .attr('fill', 'black')
    //.attr('font-family','Helvetica, Arial, sans-serif')
    .text('X');

  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  if (sites.length <= 50) {
    xAxis.tickFormat(d => d);
  } else {
    xAxis.tickFormat((d, i) => i % 10 === 0 ? d : '');
  }

  svgElement.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'end')
    .attr('dx', '-7px')
    .attr('dy', '-5px');

  svgElement.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).tickSizeOuter(0));
    const defs = svgElement.append('defs');
}
updateHeatmap();
});
</script>

<style scoped>
.tooltip {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    opacity: 0;
}
</style>