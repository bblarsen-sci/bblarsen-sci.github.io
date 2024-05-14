<template>
      <div class="text-center font-semibold p-6 text-xl">Zoomable Heatmap</div>
      <div class="container mx-auto max-w-6xl mb-20 max-h-screen font-light border-2 align-top" ref="svgContainer"></div>
</template>

<script>
async function fetchData() {
  const file = await fetch('/data/default_heatmap.csv');
  const file_text = await file.text();
  const test = d3.csvParse(file_text);
  return test
}
</script>

<script setup>
import { ref, computed, onMounted} from 'vue';
import * as d3 from 'd3';

// DEFINE VARIABLES
const svgContainer = ref(null);
const data = ref([]);

// DEFINE AMINO ACIDS- this is the order (from top to bottom) in which the amino acids will be displayed
const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

// DEFINE D3 FUNCTIONS
const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
const rowPadding = 30; // amount of padding between the rows
let rows = 4; // number of rows in the heatmap
let paddingValue = 0.1; // padding between the squares in the heatmap
const squareSize = 9;

function colorScale(effect) {
  return d3.scaleDiverging(d3['interpolateRdBu']).domain([-4, 0, 4])(effect);
}

const sites = computed(() => Array.from(new Set(data.value.map(d => +d.site))));

const sitesPerRow = computed(() => Math.ceil(sites.value.length / rows));

const siteRows = computed(() =>
  Array.from({ length: rows }, (_, i) =>
    sites.value.slice(i * sitesPerRow.value, (i + 1) * sitesPerRow.value)
  )
);

const maxSitesInRow = computed(() => Math.max(...siteRows.value.map(row => row.length)));

const innerWidth = computed(() => squareSize * maxSitesInRow.value);

const width = computed(() => innerWidth.value + margin.left + margin.right);

const height = computed(() =>
  squareSize * amino_acids.length * rows +
  margin.top +
  margin.bottom +
  rowPadding * (rows - 1) +
  margin.bottom
);

const innerHeight = computed(() => height.value - margin.top - margin.bottom);

const dataLookup = computed(() =>
  data.value.reduce((lookup, dataPoint) => {
    lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
    return lookup;
  }, {})
);

const wildtypeLookup = computed(() =>
  data.value.reduce((lookup, dataPoint) => {
    lookup[dataPoint.site] = dataPoint.wildtype;
    return lookup;
  }, {})
);

const xScale = computed(() =>
  d3.scaleBand()
    .domain(Array.from({ length: maxSitesInRow.value }, (_, i) => i))
    .range([0, innerWidth.value])
    .padding(paddingValue)
);

const yScale = computed(() =>
  d3.scaleBand()
    .domain(amino_acids)
    .range([0, squareSize * amino_acids.length])
    .padding(paddingValue)
);


function updateHeatmap() {
  function zoomed(event) {
    chartGroup.attr("transform", event.transform);
  }
  
  const svg = d3.select(svgContainer.value); // Select the SVG container
  // Append a new SVG element to the container
  const svgElement = svg.append('svg') 
  .attr('width', '100%')
  //.attr('height', height.value)
  .attr('preserveAspectRatio', "xMinYMin meet")
  .attr('viewBox', `0 0 ${width.value} ${height.value}`)
  .call(d3.zoom().on("zoom", zoomed)); // Add zoom behavior to the SVG

  const chartGroup = svgElement.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    
  //Plot heatmap squares by row for wrapping
  siteRows.value.forEach((siteRow, rowIndex) => {
    chartGroup.selectAll(`rect-row-${rowIndex}`)
    .data(siteRow.flatMap(site => amino_acids.map(mutant => ({ site, mutant }))))
    .enter()
    .append('rect')
    .attr('x', d => xScale.value(siteRow.indexOf(d.site)))
    .attr('y', d => yScale.value(d.mutant) + (yScale.value.range()[1] + rowPadding) * rowIndex)
    .attr('width', xScale.value.bandwidth())
    .attr('height', yScale.value.bandwidth())
    .attr('fill', d => {
      const key = `${d.site}-${d.mutant}`;
      if (dataLookup.value[key]) {
        return colorScale(+dataLookup.value[key].effect);
      } else {
        return wildtypeLookup.value[d.site] === d.mutant ? 'white' : 'lightgray';
      }
    })
    
  // Add the wildtype 'X' text to the boxes
  chartGroup.selectAll(`.wildtype-row-${rowIndex}`)
    .data(data.value.filter(d => siteRow.includes(+d.site)))
    .enter()
    .append('text')
    .attr('class', `wildtype-row`)
    .attr('x', d => xScale.value(siteRow.indexOf(+d.site)) + xScale.value.bandwidth() / 2)
    .attr('y', d => yScale.value(d.wildtype) + (yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.bandwidth() / 2 + 3)
    .attr('text-anchor', 'middle')
    .text('X');

  const xAxis = d3.axisBottom(xScale.value).tickSizeOuter(0);
    if (siteRow.length <= 50) {
      xAxis.tickFormat(d => siteRow[d]);
    } else {
      xAxis.tickFormat((d, i) => i % 10 === 0 ? siteRow[d] : '');
    }

  // ADD THE X AND Y AXES
  // Add the site numbers to the x-axis
  chartGroup.append('g')
    .attr('class', `x-axis-row`)
    .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.range()[1]})`)
    .call(xAxis)
    .selectAll('text')
    .attr('dx', '-7px')
    .attr('dy', '-5px');
    

  // Add the amino acids to the y-axis
  chartGroup.append('g')
    .attr('class', `y-axis-row`)
    .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})`)
    .call(d3.axisLeft(yScale.value).tickSizeOuter(0));

  // ADD THE AXES TITLES
  // Add the row title
  chartGroup.append('text')
    .attr('class', 'axis-title-x')
    .attr('x', innerWidth.value / 2)
    .attr('y', innerHeight.value - 10)
    .text('Site');
      
  // Add the column title
  chartGroup.append('text')
    .attr('class', 'axis-title-y')
    //.attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight.value / 2)
    .attr('y', -margin.left)
    .attr('dy', '1em')
    .text('Amino Acid');

  
});
};


// Function to fetch the data. Checks if a file is uploaded, if not, fetches the default data which in this case is Nipah DMS entry data

// FETCH DATA ON MOUNT USING A VUE FUNCTION
onMounted(async() => {
    data.value = await fetchData()
    updateHeatmap();
});
</script>


<style>
.wildtype-row {
  font-size: 8px;
  fill: black;
}
.x-axis-row text {
  text-anchor: end;
  align: center;
  transform: rotate(-90deg);
}


.axis-title-x {
  font-size: 18px;
  text-anchor: middle;
  fill: currentColor;
}
.axis-title-y {
  font-size: 18px;
  text-anchor: middle;
  transform: rotate(-90deg);
  fill: currentColor;
}

</style>