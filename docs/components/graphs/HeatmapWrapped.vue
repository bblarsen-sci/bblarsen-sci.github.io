<template>
  <div class="container mx-auto">
    <div class="flex flex-row flex-wrap py-4">
      <aside class="w-full sm:w-1/4 md:w-1/5">
        <div class="sticky top-0 p-4 w-full overflow-hidden border-2 justify-center items-center inline-block">
          <div class="flex flex-col gap-6 text-xs font-light">
            <div class="font-bold text-xl">Heatmap Options</div>
            <div class="flex flex-col">
              <p>File must have four columns in csv: site, mutant, wildtype,effect</p>
              <p for="fileInput" class="mr-2 font-semibold">Upload CSV:</p>
              <input type="file" id="fileInput" @change="handleFileUpload" accept=".csv" class="">
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-semibold" for="siteInput">Enter Specific Sites:</label>
              <input type="text" id="siteInput" v-model="siteInputValue" class="p-2 rounded-md ring-1 ring-slate-500"
                placeholder="e.g., 1-2,3">
              <div id="updateSites" @click="selectedSites = parseSites(siteInputValue)"
                class="p-1 bg-sky-500 shadow-md shadow-sky-500 text-white rounded-md hover:ring-2 ring-sky-700 text-center ">
                Update Sites</div>
            </div>
            <div class="flex flex-col">
              <label for="paddingSelect" class="mr-2 font-semibold">Select Padding:</label>
              <select id="paddingSelect" v-model="paddingValue" class="p-2 rounded-md bg-slate-200">
                <option value="0">none</option>
                <option value="0.05">small</option>
                <option value="0.1">large</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label for="strokeSelect" class="mr-2 font-semibold">Select Stroke:</label>
              <select id="strokeSelect" v-model="strokeWidthValue" class="p-2 rounded-md bg-slate-200">
                <option value="0">0</option>
                <option value="0.25">0.25</option>
                <option value="0.5">0.5</option>
                <option value="1.0">1.0</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label for="rowsSelect" class="mr-2 font-semibold">Select Rows:</label>
              <select id="rowsSelect" v-model="rows" class="p-2 rounded-md bg-slate-200">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="8">8</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label class="mr-2 font-semibold">Change Color:</label>
              <select v-model="selectedColorScale" class="p-2 rounded-md bg-slate-200">
                <option value="interpolateRdBu">Red Blue</option>
                <option value="interpolateBrBG">Brown Green</option>
                <option value="interpolatePRGn">Purple Green</option>
                <option value="interpolatePiYG">Pink Yellow Green</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <button @click="downloadSVG"
                class="px-3 py-2 bg-sky-500 shadow-md shadow-sky-500 text-white rounded-md hover:bg-sky-600">Download
                SVG</button>
              <button @click="downloadImage"
                class="px-3 py-2 bg-sky-500 shadow-md shadow-sky-500 text-white rounded-md hover:bg-sky-600">Download
                PNG</button>
            </div>
          </div>
        </div>
      </aside>
      <main class="w-full sm:w-3/4 md:w-4/5 px-2 align-top">
        <div class="block text-xs font-extralight" ref="svgContainer"></div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import * as d3 from 'd3';
import html2canvas from 'html2canvas';

// DEFINE VARIABLES
const data = ref([]);
const svgContainer = ref(null);

const uploadedFile = ref(null);
const paddingValue = ref(0.1);
const strokeWidthValue = ref(0.0);
const rows = ref(4);
const selectedColorScale = ref('interpolateRdBu');
const siteInputValue = ref('');
const selectedSites = ref([]);


// DEFINE AMINO ACIDS- this is the order (from top to bottom) in which the amino acids will be displayed
const amino_acids = [
  "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
  "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
];

// DEFINE NORMAL FUNCTIONS
// Function to download the image
async function downloadImage() {
  try {
    const plotContainer = svgContainer.value;

    if (!plotContainer) {
      console.error('SVG element not found');
      return;
    }

    const clone = plotContainer.cloneNode(true);
    const dpi = 150; // Desired DPI
    const scaleFactor = dpi / 96; // Assume the browser is set to 96 DPI (typical browser setting)

    // Scale the cloned plot container
    clone.style.transform = `scale(${scaleFactor})`;
    clone.style.transformOrigin = "top left";

    // Append the cloned container to the body, offscreen
    clone.style.position = "fixed";
    clone.style.top = "-10000px";
    document.body.appendChild(clone);

    // Render the cloned plot as a canvas element
    const canvas = await html2canvas(clone, {
      scale: scaleFactor,
      useCORS: true,
      logging: true,
    });

    // Remove the cloned plot container
    document.body.removeChild(clone);

    // Convert the canvas to a blob
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    // Create a link to download the image
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `heatmap.png`;
    link.click();

    // Remove the link
    link.remove();
  } catch (error) {
    console.error('Error downloading image:', error);
  }
}

// Function to download the SVG
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
};

// Function to handle file upload
function handleFileUpload(event) {
  uploadedFile.value = event.target.files[0];
  fetchData();
}

// Function to parse sites entered by the user
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

// DEFINE D3 CONSTANTS
const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
const rowPadding = 30; // amount of padding between the rows
const squareSize = 9; // size of each square in the heatmap

// COMPUTED PROPERTIES
const sites = computed(() => {
  if (selectedSites.value.length > 0) {
    return Array.from(new Set(data.value.map(d => +d.site))).filter(site => selectedSites.value.includes(site));
  } else {
    return Array.from(new Set(data.value.map(d => +d.site)));
  }
});

const sitesPerRow = computed(() => Math.ceil(sites.value.length / rows.value));

const siteRows = computed(() => {
  if (selectedSites.value.length > 0) {
    return [sites.value];
  } else {
    return Array.from({ length: rows.value }, (_, i) =>
      sites.value.slice(i * sitesPerRow.value, (i + 1) * sitesPerRow.value)
    );
  }
});

const maxSitesInRow = computed(() => {
  if (selectedSites.value.length > 0) {
    return selectedSites.value.length;
  } else {
    return Math.max(...siteRows.value.map(row => row.length));
  }
});
const innerWidth = computed(() => squareSize * maxSitesInRow.value);

const width = computed(() => innerWidth.value + margin.left + margin.right);

const height = computed(() => {
  if (selectedSites.value.length > 0) {
    return (
      squareSize * amino_acids.length +
      margin.top +
      margin.bottom +
      margin.bottom
    );
  } else {
    return (
      squareSize * amino_acids.length * rows.value +
      margin.top +
      margin.bottom +
      rowPadding * (rows.value - 1) +
      margin.bottom
    );
  }
});

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
const uniqueWildtypes = computed(() => {
  const map = new Map();
  data.value.forEach(d => {
    if (!map.has(+d.site)) {
      map.set(+d.site, d);
    }
  });
  return map;
});
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

///WATCH
watch([data.value, paddingValue, rows, strokeWidthValue, selectedSites], () => {
  updateHeatmap();
});

////////////// UPDATING HEATMAP ////////////////////////
function updateHeatmap() {
  const svg = d3.select(svgContainer.value); // Select the SVG container
  svg.selectAll('*').remove();

  // Append a new SVG element to the container
  const svgElement = svg.append('svg')
    .attr('width', width.value)
    .attr('height', height.value)
    .attr('viewBox', `0 0 ${width.value} ${height.value}`)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


  //Plot heatmap squares by row for wrapping
  siteRows.value.forEach((siteRow, rowIndex) => {
    svgElement.selectAll(`rect-row-${rowIndex}`)
      .data(siteRow.flatMap(site => amino_acids.map(mutant => ({ site, mutant }))))
      .enter()
      .append('rect')
      .attr('class', `rect-row`)
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
      .data(Array.from(uniqueWildtypes.value.values()).filter(d => siteRow.includes(+d.site))) // Only plot the wildtype once per site
      //.data(data.value.filter(d => siteRow.includes(+d.site)))
      .enter()
      .append('text')
      .attr('class', `wildtype-row`)
      .attr('font-size', '8px')
      .attr('text-anchor', 'middle')
      .attr('text-align', 'center')
      .attr('font-weight', 'light')
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
      //.attr('class', `x-axis-row`)
      .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.range()[1]})`)
      .call(xAxis)
      .selectAll('text')
      .attr('dx', '-7px')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'end')
      .attr('dy', '-5px');

    // Add the amino acids to the y-axis
    svgElement.append('g')
      //.attr('class', `y-axis-row`)
      .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})`)
      .call(d3.axisLeft(yScale.value).tickSizeOuter(0));

    // ADD THE AXES TITLES
    // Add the row title
    svgElement.append('text')
      //.attr('class', 'axis-title-x')
      .attr('x', innerWidth.value / 2)
      .attr('y', innerHeight.value - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('fill', 'currentColor')
      .text('Site');

    // Add the column title
    svgElement.append('text')
      //.attr('class', 'axis-title-y')
      .attr('x', -innerHeight.value / 2)
      .attr('y', margin.left - 80)
      .attr('dx', '1em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'currentColor')
      .attr('transform', 'rotate(-90)')
      .attr('font-size', '16px')
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
onMounted(async () => {
  data.value = await fetchData()
  updateHeatmap();
});
</script>


<style></style>