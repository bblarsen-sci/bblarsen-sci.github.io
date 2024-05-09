<template>
      <div class="mx-auto px-2 lg:px-24 font-extralight text-2xl " ref="svgContainer"></div>
</template>

<script setup>
import { ref, watch, onMounted} from 'vue';
import * as d3 from 'd3';

// DEFINE VARIABLES
const svgContainer = ref(null);

// DEFINE AMINO ACIDS- this is the order (from top to bottom) in which the amino acids will be displayed
const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

// VUE FUNCTION - UPDATE HEATMAP IF ANY OF THE DATA CHANGES FOR THESE VARIABLES
//watch([], () => {
//  updateHeatmap();
//});



// main plotting function
function updateHeatmap(data) {
  let filteredData = data; // assign data to filtered data, otherwise it gets overwritten when filtering

  // DEFINE D3 FUNCTIONS
  const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
  const rowPadding = 30; // amount of padding between the rows
  let rows = 4; // number of rows in the heatmap
  let paddingValue = 0.1; // padding between the squares in the heatmap
  let selectedColorScale = 'interpolateRdBu'; // default color scale

  // Filter the data based on the selected amino acid and sites
  // These are the sites we will show
  const sites = Array.from(new Set(filteredData.map(d => +d.site)));
  // How many sites will we have in each row?
  const sitesPerRow = Math.ceil(sites.length / rows);
  // Split the sites into rows
  const siteRows = Array.from({ length: rows }, (_, i) =>
    sites.slice(i * sitesPerRow, (i + 1) * sitesPerRow)
  );

  // Get the maximum number of sites in a row
  const maxSitesInRow = Math.max(...siteRows.map(row => row.length));
  const squareSize = 9; // size of each square in the heatmap
  const innerWidth = squareSize * maxSitesInRow; // width of the heatmap
  const width = innerWidth + margin.left + margin.right; // width of the SVG
  const height = squareSize * amino_acids.length * rows + margin.top + margin.bottom + rowPadding * (rows - 1) + margin.bottom; // height of the SVG
  const innerHeight = height - margin.top - margin.bottom; // height of the heatmap

  // D3 FIGURE MAKING
  // Create the color scale
  let colorScale = d3.scaleDiverging(d3[selectedColorScale])
    .domain([-4, 0, 4]);

  // SETUP THE SCALES
  // Setup the Y-scale
  const yScale = d3.scaleBand()
    .domain(amino_acids)
    .range([0, squareSize * amino_acids.length])
    .padding(paddingValue);
  
  // Setup the X-scale
  const xScale = d3.scaleBand()
    .domain(Array.from({ length: maxSitesInRow }, (_, i) => i))
    .range([0, innerWidth])
    .padding(paddingValue);
  
  const svg = d3.select(svgContainer.value); // Select the SVG container

  // Append a new SVG element to the container
  const svgElement = svg.append('svg') 
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // This code creates a lookup table for the data, so we can easily find the data for a specific site and amino acid and vastly improves performance.
  const dataLookup = filteredData.reduce((lookup, dataPoint) => {
    lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
    return lookup;
  }, {});

  // This code creates a lookup table for the wildtype amino acid at each site, so we can easily find the wildtype for a specific site and vastly improves performance.
  const wildtypeLookup = filteredData.reduce((lookup, dataPoint) => {
    lookup[dataPoint.site] = dataPoint.wildtype;
    return lookup;
  }, {});
    
  //Plot heatmap squares by row for wrapping
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
    
    

  // Add the wildtype 'X' text to the boxes
  svgElement.selectAll(`.wildtype-row-${rowIndex}`)
    .data(filteredData.filter(d => siteRow.includes(+d.site)))
    .join('text')
    .attr('class', `wildtype-row-${rowIndex}`)
    .attr('x', d => xScale(siteRow.indexOf(+d.site)) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.wildtype) + (yScale.range()[1] + rowPadding) * rowIndex + yScale.bandwidth() / 2 + 3)
    .attr('text-anchor', 'middle')
    .text('X');

  // Add the site numbers to the x-axis, only plotting every 10 sites
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  if (siteRow.length <= 50) {
    xAxis.tickFormat(d => siteRow[d]);
  } else {
    xAxis.tickFormat((d, i) => i % 10 === 0 ? siteRow[d] : '');
  }

  // ADD THE X AND Y AXES
  // Add the site numbers to the x-axis
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

  // ADD THE AXES TITLES
  // Add the row title
  svgElement.append('text')
    .attr('class', 'x-axis-title')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + margin.bottom - 50)
    .attr('text-anchor', 'middle')
    .text('Site');
      
  // Add the column title
  svgElement.append('text')
    .attr('class', 'y-axis-title')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -margin.left)
    .attr('dy', '1em')
    .attr('text-anchor', 'middle')
    .text('Amino Acid');

  
});
};

// Function to fetch the data. Checks if a file is uploaded, if not, fetches the default data which in this case is Nipah DMS entry data
async function fetchData() {
    const file = await fetch('/data/default_heatmap.csv');
    const file_text = await file.text();
    const csv = d3.csvParse(file_text);
    const data = csv;
    updateHeatmap(data);

  }


// FETCH DATA ON MOUNT USING A VUE FUNCTION
onMounted(() => {
    fetchData();
});
</script>


<style>
.wildtype-row-0 {
  font-size: 8px;
  fill: black;
}

.wildtype-row-1 {
  font-size: 8px;
  fill: black;
}

.wildtype-row-2 {
  font-size: 8px;
  fill: black;
}

.wildtype-row-3 {
  font-size: 8px;
  fill: black;
}

.x-axis-title  {
  font-size: 18px;
  fill: black;
}

.y-axis-title  {
  font-size: 18px;
  fill: black;
}
</style>