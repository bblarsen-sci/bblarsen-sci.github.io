<template>
  <div class="flex flex-row">
    <div class="max-w-[250px] my-4 flex-col">
      <sidebar @downloadSVG="downloadSVGHandler" @downloadImage="downloadPNGHandler">
        <template #title>Heatmap Options</template>
        <template #content>
          <!-- Add the sidebar content here -->
          <label class="">Enter Specific Sites:</label>
          <input class="form-input" @input="siteInputValue = $event.target.value" placeholder="e.g., 1-12,15" />
          <button class="btn-primary" @click="selectedSites = parseSites(siteInputValue)">Update Sites</button>
          <label class="">Select Padding:</label>
          <select class="form-select" v-model="paddingValue">
            <option v-for="option in paddingOptions" :value="option" :key="option">{{ option }}</option>
          </select>
          <label class="">Select Stroke Width:</label>
          <select class="form-select" v-model="strokeWidthValue">
            <option v-for="option in strokeOptions" :value="option" :key="option">{{ option }}</option>
          </select>
          <label class="">Select Color Scale:</label>
          <select class="form-select" v-model="selectedColorScale">
            <option v-for="option in colorOptions" :value="option" :key="option">{{ option }}</option>
          </select>
          <label class="">Select Number of Rows:</label>
          <select class="form-select" v-model="rows">
            <option v-for="option in rowOptions" :value="option" :key="option">{{ option }}</option>
          </select>
        </template>
      </sidebar>
    </div>
    <main class="px-2">
      <svg id="svgContainer" ref="svgContainer"></svg>
    </main>
    <Tooltip ref="tooltip" :data="tooltipData" />
  </div>
</template>

<script setup>
import { ref, watch, computed, shallowRef } from 'vue';
import sidebar from '/components/components/sidebar.vue';
import * as d3 from 'd3';
import { Legend } from '/components/utilities/legend.js';
import Tooltip from '/components/components/simpleTooltip.vue';
import downloadSVG from '/components/utilities/downloadSVG.js';
import downloadPNG from '/components/utilities/downloadPNG.js';
import { useFetch } from '/components/composables/useFetch.js';

// DEFINE REACTIVE VARIABLES
const processedData = shallowRef(null);
const svgContainer = shallowRef(null);
const tooltip = ref(null);
const tooltipData = ref([]);

const paddingValue = ref(0.1);
const strokeWidthValue = ref(0.0);
const rows = ref(4);
const selectedColorScale = ref('interpolateRdBu');
const siteInputValue = ref('');
const selectedSites = ref([]);

const min = -4;
const max = 4;
const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
const rowPadding = 30; // amount of padding between the rows
const squareSize = 9; // size of each square in the heatmap

// DEFINE REACTIVE OPTIONS
const colorOptions = [
  'interpolateRdBu',
  'interpolateBrBG',
  'interpolatePRGn',
  'interpolatePiYG',
  'interpolatePuOr',
  'interpolateSpectral',
];

const rowOptions = [1, 2, 3, 4, 5, 6];

const paddingOptions = [0, 0.05, 0.1, 0.15, 0.2];

const strokeOptions = [0, 0.5, 1];

// DEFINE NON-REACTIVE VARIABLES
const amino_acids = [
  'R',
  'K',
  'H',
  'D',
  'E',
  'Q',
  'N',
  'S',
  'T',
  'Y',
  'W',
  'F',
  'A',
  'I',
  'L',
  'M',
  'V',
  'G',
  'P',
  'C',
];

// Fetch the data from the URL using composable
const { data } = useFetch(
  'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv'
);

watch(data, (newData) => {
  if (newData) {
    const array = newData.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      effect: +Object.values(d)[3],
    }));
    console.log('data processed')
    processedData.value = array;
  }
});

function downloadPNGHandler() {
  downloadPNG(svgContainer.value);
}

function downloadSVGHandler() {
  downloadSVG(svgContainer.value);
}

// Function to parse sites entered by the user
function parseSites(input) {
  const ranges = input.split(',').map((s) => s.trim());
  let sites = [];
  ranges.forEach((range) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      sites = sites.concat(Array.from({ length: end - start + 1 }, (_, i) => start + i));
    } else {
      sites.push(Number(range));
    }
  });
  return sites;
}

// COMPUTED PROPERTIES
const sites = computed(() => {
  if (!processedData.value) return []; // Return an empty array if processedData is null

  if (selectedSites.value.length > 0) {
    return Array.from(new Set(processedData.value.map((d) => +d.site))).filter((site) =>
      selectedSites.value.includes(site)
    );
  } else {
    return Array.from(new Set(processedData.value.map((d) => +d.site)));
  }
});

function sitesPerRow() {
  return Math.ceil(sites.value.length / rows.value);
}

const siteRows = computed(() => {
  if (selectedSites.value.length > 0) {
    return [sites.value];
  } else {
    return Array.from({ length: rows.value }, (_, i) =>
      sites.value.slice(i * sitesPerRow(), (i + 1) * sitesPerRow())
    );
  }
});

function maxSitesInRow() {
  if (selectedSites.value.length > 0) {
    return selectedSites.value.length;
  } else {
    return Math.max(...siteRows.value.map((row) => row.length));
  }
}

function calculateInnerWidth() {
  return squareSize * maxSitesInRow()
}

function width() {
  return calculateInnerWidth() + margin.left + margin.right;
}

function height() {
  if (selectedSites.value.length > 0) {
    return squareSize * amino_acids.length + margin.top + margin.bottom + margin.bottom;
  } else {
    return (
      squareSize * amino_acids.length * rows.value +
      margin.top +
      margin.bottom +
      rowPadding * (rows.value - 1) +
      margin.bottom
    );
  }
}

function innerHeight() {
  return height() - margin.top - margin.bottom;
}

const dataLookup = computed(() => {
  return processedData.value.reduce((lookup, dataPoint) => {
    lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
    return lookup;
  }, {});
});

const wildtypeLookup = computed(() => {
  return processedData.value.reduce((lookup, dataPoint) => {
    lookup[dataPoint.site] = dataPoint.wildtype;
    return lookup;
  }, {})
});

const uniqueWildtypes = computed(() => {
  const map = new Map();
  processedData.value.forEach((d) => {
    if (!map.has(+d.site)) {
      map.set(+d.site, d);
    }
  });
  return map;
});

const xScale = computed(() => {
  return d3
    .scaleBand()
    .domain(Array.from({ length: maxSitesInRow() }, (_, i) => i))
    .range([0, calculateInnerWidth()])
    .padding(paddingValue.value);
});

const yScale = computed(() => {
  return d3
    .scaleBand()
    .domain(amino_acids)
    .range([0, squareSize * amino_acids.length])
    .padding(paddingValue.value);
});

////////////// UPDATING FUNCTIONS ////////////////////////
const colorScale = computed(() => {
  return d3.scaleDiverging(d3[selectedColorScale.value]).domain([min, 0, max]);
});

///WATCH
watch([processedData, xScale, rows, selectedSites, strokeWidthValue, colorScale], () => {
  updateHeatmap();
});


function updateHeatmap() {
  const svg = d3.select(svgContainer.value); // Select the SVG container
  svg.selectAll('*').remove(); // Clear the SVG container. This is necessary to update the plot when the data changes.

  const svgElement = d3
    .select(svgContainer.value)
    .attr('width', width())
    .attr('height', height())
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  //Plot heatmap squares by row for wrapping
  siteRows.value.forEach((siteRow, rowIndex) => {
    svgElement
      .selectAll(`rect-row-${rowIndex}`)
      .data(siteRow.flatMap((site) => amino_acids.map((mutant) => ({ site, mutant }))))
      .enter()
      .append('rect')
      .attr('x', (d) => xScale.value(siteRow.indexOf(d.site)))
      .attr('y', (d) => yScale.value(d.mutant) + (yScale.value.range()[1] + rowPadding) * rowIndex)
      .attr('width', xScale.value.bandwidth())
      .attr('height', yScale.value.bandwidth())
      .attr('fill', (d) => {
        const key = `${d.site}-${d.mutant}`;
        if (dataLookup.value[key]) {
          return colorScale.value(+dataLookup.value[key].effect);
        } else {
          return wildtypeLookup.value[d.site] === d.mutant ? 'white' : 'lightgray';
        }
      })
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidthValue.value)
      .on('mouseover', (event, d) => {
        const key = `${d.site}-${d.mutant}`;
        if (dataLookup.value[key]) {
          tooltip.value.showTooltip(event);
          tooltipData.value = [
            { label: 'Site', value: d.site },
            { label: 'Wildtype', value: wildtypeLookup.value[d.site] },
            { label: 'Mutant', value: d.mutant },
            { label: 'Effect', value: parseFloat(dataLookup.value[key].effect.toFixed(2)) },
        ];
        }
      })
      .on('mouseout', () => {
        tooltip.value.hideTooltip();
      });

    // Add the wildtype 'X' text to the boxes
    svgElement
      .selectAll(`.wildtype-row-${rowIndex}`)
      .data(Array.from(uniqueWildtypes.value.values()).filter((d) => siteRow.includes(+d.site))) // Only plot the wildtype once per site
      .enter()
      .append('text')
      .attr('class', `wildtype-row`)
      .attr('x', (d) => xScale.value(siteRow.indexOf(+d.site)) + xScale.value.bandwidth() / 2)
      .attr(
        'y',
        (d) =>
          yScale.value(d.wildtype) +
          (yScale.value.range()[1] + rowPadding) * rowIndex +
          yScale.value.bandwidth() / 2 +
          3
      )
      .attr('font-size', '8px')
      .attr('text-anchor', 'middle')
      .attr('text-align', 'center')
      .attr('font-weight', 'light')
      .text('X');

    // Add the site numbers to the x-axis, only plotting every 10 sites
    const xAxis = d3.axisBottom(xScale.value).tickSizeOuter(0);
    if (siteRow.length <= 50) {
      xAxis.tickFormat((d) => siteRow[d]);
    } else {
      xAxis.tickFormat((d, i) => (i % 10 === 0 ? siteRow[d] : ''));
    }

    // ADD THE X AND Y AXES
    // Add the site numbers to the x-axis
    svgElement
      .append('g')
      .attr(
        'transform',
        `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.range()[1]})`
      )
      .call(xAxis)
      .selectAll('text')
      .attr('dx', '-7px')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'end')
      .attr('dy', '-5px');

    // Add the amino acids to the y-axis
    svgElement
      .append('g')
      .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})`)
      .call(d3.axisLeft(yScale.value).tickSizeOuter(0));

    // Add the row title
    svgElement
      .append('text')
      .attr('class', 'axis-title-x')
      .attr('x', calculateInnerWidth() / 2)
      .attr('y', innerHeight())
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .attr('text-align', 'center')
      .attr('fill', 'currentColor')
      .text('Site');

    // Add the column title
    svgElement
      .append('text')
      .attr('class', 'axis-title-y')
      .attr('x', -innerHeight() / 2 + 20)
      .attr('y', 0 - 30)
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'currentColor')
      .text('Amino Acid');
  });

  Legend(d3.scaleDiverging([min, 0, max], d3[selectedColorScale.value]).clamp(true), {
    svgRef: '#svgContainer',
    title: 'Cell Entry',
    width: 150,
    tickValues: [min, 0, max],
    xcoord: margin.left,
    ycoord: innerHeight() + 20,
    fontSize: 14,

  });
}
</script>
