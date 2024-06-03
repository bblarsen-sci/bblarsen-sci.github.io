---
layout: doc
title: Heatmap wrapped in rows
aside: false
date: 2024-05-03
keywords:
  - D3
subtext: Heatmap of deep mutational scanning data that is wrapped in multiple rows and allows customization.
thumbnail: /thumbnails/d3_heatmap_wrapped.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>

<div class="w-full px-2 lg:px-6 ">
    <div class="flex flex-row py-4">
      <aside class="w-full sm:w-1/4 md:w-1/6">
        <sidebar v-model:rows="rows" v-model:selectedColorScale="selectedColorScale" v-model:paddingValue="paddingValue"
          v-model:strokeWidthValue="strokeWidthValue" :rowOptions="rowOptions" :colorOptions="colorOptions"
          :paddingOptions="paddingOptions" :strokeOptions="strokeOptions" :parseSites="parseSites"
          :selectedSites="selectedSites" :siteInputValue="siteInputValue"
          @update:siteInputValue="siteInputValue = $event" @update:selectedSites="selectedSites = $event"
          @downloadSVG="downloadSVG" @downloadImage="downloadImage" />
      </aside>
      <main class="w-full sm:w-3/4 md:w-5/6 px-2">
        <svg ref='svgContainer'></svg>
      </main>
    </div>
    <Tooltip ref="tooltip" />
  </div>

<script setup>
  import { ref, watch, onMounted, computed, shallowRef, onBeforeMount } from 'vue';
  import sidebar from '/components/sidebar.vue';
  import * as d3 from 'd3';
  import { Legend } from '/components/legend.js';
  import Tooltip from '/components/tooltip.vue';

const dataFile = 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv';


  // DEFINE REACTIVE VARIABLES
  const data = shallowRef([]);
  const legend = shallowRef(null);
  const svgContainer = shallowRef(null);

  const paddingValue = ref(0.1);
  const strokeWidthValue = ref(0.0);
  const rows = ref(4);
  const selectedColorScale = ref('interpolateRdBu');
  const siteInputValue = ref('');
  const selectedSites = ref([]);
  const tooltip = ref(null);

  const min = ref(-4);
  const max = ref(4);

  // DEFINE REACTIVE OPTIONS
  const colorOptions = [
    'interpolateRdBu',
    'interpolateBrBG',
    'interpolatePRGn',
    'interpolatePiYG',
    'interpolatePuOr',
    'interpolateSpectral',
  ]

  const rowOptions = [1, 2, 3, 4, 5, 6];

  const paddingOptions = [0, 0.05, 0.1,0.15, 0.2];

  const strokeOptions = [0, 0.5, 1];

  // DEFINE NON-REACTIVE VARIABLES
  const amino_acids = [
    "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
    "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
  ];

  let svgElement = null;

  const margin = { top: 20, right: 20, bottom: 50, left: 50 }; // margin for the SVG
  const rowPadding = 30; // amount of padding between the rows
  const squareSize = 9; // size of each square in the heatmap


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
      const dpi = 200; // Desired DPI
      const scaleFactor = dpi / 96; // Assume the browser is set to 96 DPI (typical browser setting)

      // Scale the cloned plot container
      clone.style.transform = `scale(${scaleFactor})`;
      clone.style.transformOrigin = "top right";

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

  const xScale = computed(() => {
    return d3.scaleBand()
      .domain(Array.from({ length: maxSitesInRow.value }, (_, i) => i))
      .range([0, innerWidth.value])
      .padding(paddingValue.value)
  });

  const yScale = computed(() => {
    return d3.scaleBand()
      .domain(amino_acids)
      .range([0, squareSize * amino_acids.length])
      .padding(paddingValue.value)
  });

  ////////////// UPDATING FUNCTIONS ////////////////////////
  const colorScale = computed(() => {
    return d3.scaleDiverging(d3[selectedColorScale.value]).domain([min.value, 0, max.value]);
  });



  ///WATCH
  watch([data, xScale, rows, selectedSites, strokeWidthValue, colorScale], () => {
    updateHeatmap();
  });

  function makeSvg() {
    const svgElement = d3.select(svgContainer.value)
      .attr('width', width.value)
      .attr('height', height.value)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    return svgElement;
  }

  function updateHeatmap() {
    const svg = d3.select(svgContainer.value); // Select the SVG container
    svg.selectAll('*').remove(); // Clear the SVG container. This is necessary to update the plot when the data changes.

    svgElement = makeSvg();

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
        .on('mouseover', (event, d) => {
          const key = `${d.site}-${d.mutant}`;
          if (dataLookup.value[key]) {
            tooltip.value.showTooltip(event);
            tooltip.value.data = {
              site: d.site,
              mutant: d.mutant,
              wildtype: wildtypeLookup.value[d.site],
              effect: dataLookup.value[key].effect,
            };
            const cellColor = colorScale.value(+dataLookup.value[key].effect);
            tooltip.value.color = cellColor;
          }
        })
        .on('mouseout', () => {
          tooltip.value.hideTooltip();
        });

      // Add the wildtype 'X' text to the boxes
      svgElement.selectAll(`.wildtype-row-${rowIndex}`)
        .data(Array.from(uniqueWildtypes.value.values()).filter(d => siteRow.includes(+d.site))) // Only plot the wildtype once per site
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
        .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex + yScale.value.range()[1]})`)
        .call(xAxis)
        .selectAll('text')
        .attr('dx', '-7px')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dy', '-5px');

      // Add the amino acids to the y-axis
      svgElement.append('g')
        .attr('transform', `translate(0, ${(yScale.value.range()[1] + rowPadding) * rowIndex})`)
        .call(d3.axisLeft(yScale.value).tickSizeOuter(0))

      // Add the row title
      svgElement.append('text')
        .attr('class', 'axis-title-x')
        .attr('x', innerWidth.value / 2)
        .attr('y', innerHeight.value)
        .text('Site');

      // Add the column title
      svgElement.append('text')
        .attr('class', 'axis-title-y')
        .attr('x', -innerHeight.value / 2 + 20)
        .attr('y', 0 - 30)
        .text('Amino Acid');
    });


    Legend(d3.scaleDiverging([min.value, 0, max.value], d3[selectedColorScale.value]).clamp(true), {
      //svgRef: legend.value,
      title: "Cell Entry",
      width: 150,
      tickValues: [min.value, 0, max.value],
      xcoord: 0,
      ycoord: innerHeight.value + 20,
    })
  };
  fetchData();
  async function fetchData() {
    try {
      const response = await fetch(dataFile);
      const file_text = await response.text();
      const csv = d3.csvParse(file_text);
      const array = csv.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      effect: +d.entry_CHO_bEFNB3,
    }));
      data.value = array;
    } catch (error) {
      console.error('Error fetching CSV file:', error);
    }
  }

  watch(data, () => {
    updateHeatmap();
  });
  
</script>

<style>
  .axis-title-y {
    font-size: 14px;
    text-anchor: middle;
    transform: rotate(-90deg);
    fill: currentColor;
  }

  .axis-title-x {
    font-size: 14px;
    text-anchor: middle;
    text-align: center;
    fill: currentColor;
  }

  .wildtype-row {
    font-size: 8px;
    text-anchor: middle;
    text-align: center;
    font-weight: light;
  }
</style>
