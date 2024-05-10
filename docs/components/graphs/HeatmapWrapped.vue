<template>
  <div class="p-6">
    <div class="flex flex-col justify-evenly items-center text-center gap-6">
      <div>
        <label for="fileInput" class="mr-2">Upload CSV:</label>
        <input type="file" id="fileInput" @change="handleFileUpload" accept=".csv" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>

      <div class="flex flex-col sm:flex-row justify-between gap-4 sm:gap-8">
        <div>
          <label for="paddingSelect" class="mr-2">Select Padding:</label>
          <select id="paddingSelect" v-model="paddingValue" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="0">none</option>
            <option value="0.05">medium</option>
            <option value="0.1">large</option>
          </select>
        </div>

        <div>
          <label for="strokeSelect" class="mr-2">Select Stroke Size:</label>
          <select id="strokeSelect" v-model="strokeWidthValue" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="0">0</option>
            <option value="0.25">0.25</option>
            <option value="0.5">0.5</option>
            <option value="1.0">1.0</option>
          </select>
        </div>

        <div>
          <label for="rowsSelect" class="mr-2">Select rows:</label>
          <select id="rowsSelect" v-model="rows" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="8">8</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4">
        <label class="mb-2 sm:mb-0">Change color:</label>
        <select v-model="selectedColorScale" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="interpolateRdBu">Red Blue</option>
          <option value="interpolateBrBG">Brown Green</option>
          <option value="interpolatePRGn">Purple Green</option>
          <option value="interpolatePiYG">Pink Yellow Green</option>
        </select>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <button @click="downloadSVG" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Download SVG</button>
        <button @click="downloadImage('png')" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Download PNG</button>
        <button @click="downloadImage('jpg')" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Download JPG</button>
      </div>
    </div>

    <div class="mt-8">
      <div class="mx-auto" ref="svgContainer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed} from 'vue';
import { saveAs } from 'file-saver';
import * as d3 from 'd3';

// DEFINE VARIABLES
const rows = ref(4);
const svgContainer = ref(null);
const strokeWidthValue = ref(0.0);
const data = ref([]);
const uploadedFile = ref(null);
const paddingValue = ref(0.1);
const selectedColorScale = ref('interpolateRdBu');


// DEFINE AMINO ACIDS- this is the order (from top to bottom) in which the amino acids will be displayed
const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

// DEFINE NORMAL FUNCTIONS
// Function to download the image
function downloadImage(format) {
  const svgElement = document.querySelector('svg');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const svgWidth = svgElement.getAttribute('width');
  const svgHeight = svgElement.getAttribute('height');

  
  canvas.width = (svgWidth * 4);
  canvas.height = (svgHeight * 4);

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

// Function to download the SVG
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

// Function to handle file upload
function handleFileUpload(event) {
  uploadedFile.value = event.target.files[0];
  fetchData();
}

// DEFINE D3 FUNCTIONS
const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
const rowPadding = 30; // amount of padding between the rows
const squareSize = 9; // size of each square in the heatmap

const sites = computed(() => Array.from(new Set(data.value.map(d => +d.site))));

const sitesPerRow = computed(() => Math.ceil(sites.value.length / rows.value));

const siteRows = computed(() =>
  Array.from({ length: rows.value }, (_, i) =>
    sites.value.slice(i * sitesPerRow.value, (i + 1) * sitesPerRow.value)
  )
);

const maxSitesInRow = computed(() => Math.max(...siteRows.value.map(row => row.length)));

const innerWidth = computed(() => squareSize * maxSitesInRow.value);

const width = computed(() => innerWidth.value + margin.left + margin.right);

const height = computed(() =>
  squareSize * amino_acids.length * rows.value +
  margin.top +
  margin.bottom +
  rowPadding * (rows.value - 1) +
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
    .padding(paddingValue.value)
);

const yScale = computed(() =>
  d3.scaleBand()
    .domain(amino_acids)
    .range([0, squareSize * amino_acids.length])
    .padding(paddingValue.value)
);

////////////// UPDATING FUNCTIONS ////////////////////////
const colorScale = computed(() => {
  return d3.scaleDiverging(d3[selectedColorScale.value]).domain([-4, 0, 4]);
});

watch(selectedColorScale, () => {
  updateColorScale();
});


function updateColorScale() {
  d3.selectAll('rect')
    .attr('fill', d => {
      const key = `${d.site}-${d.mutant}`;
      if (dataLookup.value[key]) {
        return colorScale.value(+dataLookup.value[key].effect);
      } else {
        return wildtypeLookup.value[d.site] === d.mutant ? 'white' : 'lightgray';
      }
    });
}
///
watch([paddingValue, rows], () => {
  updateHeatmap();
});


////////////// UPDATING FUNCTIONS ////////////////////////






function updateHeatmap() {
  const svg = d3.select(svgContainer.value); // Select the SVG container
  svg.selectAll('*').remove();

  // Append a new SVG element to the container
  const svgElement = svg.append('svg') 
    .attr('width', width.value)
    .attr('height', height.value)
    .attr('viewBox', `0 0 ${width.value} ${height.value}`)
    //.call(zoom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    
  //Plot heatmap squares by row for wrapping
  siteRows.value.forEach((siteRow, rowIndex) => {
  svgElement.selectAll(`rect-row-${rowIndex}`)
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
        return colorScale.value(+dataLookup.value[key].effect);
      } else {
        return wildtypeLookup.value[d.site] === d.mutant ? 'white' : 'lightgray';
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', strokeWidthValue.value)
    

  // Add the wildtype 'X' text to the boxes
  svgElement.selectAll(`.wildtype-row-${rowIndex}`)
    .data(data.value.filter(d => siteRow.includes(+d.site)))
    .enter()
    .append('text')
    .attr('class', `wildtype-row`)
    .attr('x', d => xScale.value(siteRow.indexOf(+d.site)) + xScale.value.bandwidth() / 2)
    .attr('y', d => yScale.value(d.wildtype) + (yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.bandwidth() / 2 + 3)
    .text('X');

  // Add the site numbers to the x-axis, only plotting every 10 sites
  const xAxis = d3.axisBottom(xScale.value).tickSizeOuter(0);
  if (siteRow.length <= 50) {
    xAxis.tickFormat(d => siteRow[d]);
  } else {
    xAxis.tickFormat((d, i) => i % 10 === 0 ? siteRow[d] : '');
  }

  // ADD THE X AND Y AXES
  // Add the site numbers to the x-axis
  svgElement.append('g')
    .attr('class', `x-axis-row`)
    .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.range()[1]})`)
    .call(xAxis)
    .selectAll('text')
    .attr('dx', '-7px')
    .attr('dy', '-5px');

  // Add the amino acids to the y-axis
  svgElement.append('g')
    .attr('class', `y-axis-row`)
    .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})`)
    .call(d3.axisLeft(yScale.value).tickSizeOuter(0));

  // ADD THE AXES TITLES
  // Add the row title
  svgElement.append('text')
    .attr('class', 'axis-title-x')
    .attr('x', innerWidth.value / 2)
    .attr('y', innerHeight.value + margin.bottom-10)
    .text('Site');
      
  // Add the column title
  svgElement.append('text')
    .attr('class', 'axis-title-y')
    .attr('x', -innerHeight.value / 2)
    .attr('y', -margin.left)
    .attr('dy', '1em')
    .text('Amino Acid');


});
};

// Function to fetch the data. Checks if a file is uploaded, if not, fetches the default data which in this case is Nipah DMS entry data
async function fetchData() {
  if (uploadedFile.value) {
    const file = uploadedFile.value;
    const reader = new FileReader();
    reader.onload = () => {
      const file_text = reader.result;
      const csv = d3.csvParse(file_text);
      return csv
    };
    reader.readAsText(file);
  } else {
    const file = await fetch('/data/default_heatmap.csv');
    const file_text = await file.text();
    const csv = d3.csvParse(file_text);
    return csv
  }
}

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
  transform: rotate(-90deg);
}

.axis-title-x {
  font-size: 18px;
  fill: black;
  text-anchor: middle;
}
.axis-title-y {
  font-size: 18px;
  fill: black;
  text-anchor: middle;
  transform: rotate(-90deg);
}
</style>