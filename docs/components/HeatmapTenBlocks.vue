<template>
    <div class="flex flex-col justify-center items-center">
      <div class="m-2 text-xs">
        <label for="siteInput">Enter Specific Sites:</label>
        <input type="text" id="siteInput" v-model="siteInputValue" class="mx-2 px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., 555-560, 590-600">
        <button id="updateSites" @click="selectedSites = parseSites(siteInputValue)" class="ml-2 px-4 py-2 shadow-md bg-sky-800 shadow-md shadow-sky-800 text-white rounded-lg hover:ring-2 ring-sky-500 text-white rounded-xl">Update</button>
      </div>
      <div class="m-2 text-xs">
        <label for="paddingSelect" class="mr-2">Select Padding:</label>
        <select id="paddingSelect" v-model="paddingValue" class="px-1 py-1 rounded-md align-middle text-center ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="0">none</option>
          <option value="0.01">thin</option>
          <option value="0.05">medium</option>
          <option value="0.1">large</option>
        </select>
      </div>
      <div class="m-2 text-xs">
        <label for="strokeSelect" class="mr-2">Select Stroke Size:</label>
        <select id="strokeSelect" v-model="strokeWidthValue" class="px-1 py-1 align-middle text-center rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="0">0</option>
          <option value="0.25">0.25</option>
          <option value="0.5">0.5</option>
          <option value="1.0">1.0</option>
        </select>
      </div>
      <div class="m-2 text-xs">
        <label for="wildtypeSelect" class="mr-2">Select Wildtype Amino Acid:</label>
        <select id="wildtypeSelect" v-model="selectedAminoAcid" class="px-2 py-2 rounded-md ring-1 ring-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="">All</option>
          <option v-for="aa in amino_acids" :value="aa" :key="aa">{{ aa }}</option>
        </select>
      </div>
      <div ref="svgContainer"></div>
      <div class="flex justify-between">
        <button @click="prevSites" class="px-4 py-2 bg-sky-800 shadow-md shadow-sky-800 text-white rounded-lg hover:ring-2 ring-sky-500">Prev</button>
        <button @click="nextSites" class="px-4 py-2 bg-sky-800 shadow-md shadow-sky-800 text-white rounded-lg hover:ring-2 ring-sky-500">Next</button>
      </div>
    </div>
    <div class="relative inline-block text-center">
      <div ref="tooltip" id="tooltip" class="bg-black opacity-90 shadow-md shadow-black whitespace-nowrap text-white absolute rounded-md p-2 text-sm" ></div>
    </div>
    <div class="ml-2 text-xs mt-10">
      <button @click="downloadSVG" class="px-4 py-2 bg-sky-800 shadow-md shadow-sky-800 text-white rounded-lg hover:ring-2 ring-sky-500">Download SVG</button>
    </div>
  </template>
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import * as d3 from 'd3';
  
  // Define constants
  const svgContainer = ref(null);
  const paddingValue = ref(0.05);
  const strokeWidthValue = ref(0.0);
  const selectedAminoAcid = ref('');
  const siteInputValue = ref('');
  const selectedSites = ref([]);
  const data = ref(null);
  const currentIndex = ref(0);
  const sitesPerView = 10;
  
  const amino_acids = [
    "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
    "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
  ];
  
  watch([paddingValue, strokeWidthValue, selectedAminoAcid, selectedSites, currentIndex], () => {
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
  }
  
  function downloadSVG() {
    const svgElement = document.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svgElement)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'heatmap.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }
  
  const height = 450;
  const margin = { top: 20, right: 20, bottom: 40, left: 20 };
  const innerHeight = height - margin.top - margin.bottom;
  const squareSize = Math.min(innerHeight / amino_acids.length, 20); // Define the square size based on the height and number of amino acids
  
  function updateHeatmap(data) {
    let filteredData = data; // assign data to filtered data, otherwise it gets overwritten when filtering
  
    // functions for filtering the data
    if (selectedSites.value.length > 1) {
      filteredData = filteredData.filter(d => selectedSites.value.includes(+d.site));
    }
    if (selectedAminoAcid.value) {
      filteredData = filteredData.filter(d => d.wildtype === selectedAminoAcid.value);
    }
  
    const sites = Array.from(new Set(filteredData.map(d => +d.site))); // Define sites based on the filtered data
    const visibleSites = sites.slice(currentIndex.value * sitesPerView, (currentIndex.value + 1) * sitesPerView);
  
    const allCombinations = visibleSites.flatMap(site => // Create all combinations of sites and amino acids to fill in gray for sites not found
      amino_acids.map(mutant => ({ site, mutant }))
    );
  
    const innerWidth = squareSize * visibleSites.length; // Define the inner width based on the square size and number of visible sites
    const width = innerWidth + margin.left + margin.right; // Define the total width based on the inner width and margins
  
    // D3 FIGURE MAKING
    let colorScale = d3.scaleDiverging(d3.interpolateRdBu) // Use a diverging color scale
      .domain([-4, 0, 4]);
  
    const yScale = d3.scaleBand() // Define the y scale based on the amino acids
      .domain(amino_acids)
      .range([0, innerHeight])
      .padding(paddingValue.value);
  
    const xScale = d3.scaleBand() // Define the x scale based on the visible sites
      .domain(visibleSites)
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
  
    svgElement.selectAll('rect') // Select all rectangles and fill with color based on the data.
      .data(allCombinations) // Use allCombinations instead of filteredData, then we color differently based on the dataPoint.
      .join('rect')
      .attr('x', d => xScale(d.site))
      .attr('y', d => yScale(d.mutant))
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
          tooltipText = `<div>${d.site} ${d.mutant}</div>Entry: ${parseFloat(dataPoint.entry_CHO_bEFNB2).toFixed(2)}`;
        } else {
          const wildtypePoint = filteredData.find(dp => +dp.site === d.site && dp.wildtype === d.mutant);
          if (wildtypePoint) {
            tooltipText = `Site: ${d.site}, Wildtype: ${d.mutant}`;
          } else {
            tooltipText = `Site: ${d.site}, Mutant: ${d.mutant}, Value: Missing`;
          }
        }
        const tooltip = d3.select('#tooltip');
        tooltip.html(tooltipText)
          .style('opacity', 1)
          .style('transform', `translate(${event.offsetX - margin.left + 30}px, ${event.offsetY - height - 27}px)`);
      })
      .on('mouseout', function() {
        const tooltip = d3.select('#tooltip');
        tooltip.style('opacity', 0)
          .style('transform', 'none');
      });
  
    svgElement.selectAll('.wildtype') // Add the wildtype amino acids as text
      .data(filteredData.filter(d => visibleSites.includes(+d.site)))
      .join('text')
      .attr('class', 'wildtype')
      .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() / 2 + 3)
      .attr('text-anchor', 'middle')
      .attr('font-size', '8px')
      .attr('font-weight', '100')
      .attr('fill', 'black')
      .text('X');
  
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0); // Add the x-axis
  
    svgElement.append('g') // Append the x-axis
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'end')
      .attr('dx', '-7px')
      .attr('dy', '-5px');
  
    svgElement.append('g') // Append the y-axis
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickSizeOuter(0));
  }
  
  function nextSites() {
    const sites = Array.from(new Set(data.value.map(d => +d.site)));
    if ((currentIndex.value + 1) * sitesPerView < sites.length) {
      currentIndex.value++;
    }
  }
  
  function prevSites() {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }
  
  async function fetchData() {
    const file = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv');
    const file_text = await file.text();
    const csv = d3.csvParse(file_text);
    data.value = csv;
    updateHeatmap(data.value);
  }
  
  onMounted(() => {
    fetchData();
  });
  </script>
  <style scoped>
  </style>