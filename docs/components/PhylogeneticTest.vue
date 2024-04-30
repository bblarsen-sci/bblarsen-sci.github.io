<template>
    <div>
      <div class="m-4 text-xl font-semibold">Effect of mutations on cell entry of RBP in CHO-bEFNB2 cells</div>
      <div class="flex flex-col justify-left items-left">
        <div class="m-6 text-xs">
          <label for="csvUpload" class="mr-2">Upload CSV:</label>
          <input type="file" id="csvUpload" @change="handleFileUpload" accept=".csv" class="px-2 py-2 rounded-md ring-2 ring-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div class="m-6 text-xs">
          <label for="wildtypeSelect" class="mr-2">Select Wildtype Amino Acid:</label>
          <select id="wildtypeSelect" v-model="selectedAminoAcid" class="px-2 py-2 rounded-md ring-2 ring-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All</option>
            <option v-for="aa in aminoAcids" :key="aa" :value="aa">{{ aa }}</option>
          </select>
        </div>
        <div ref="svgContainer" id="svgContainer"></div>
      </div>
      <div ref="tooltip" id="tooltip" class="tooltip"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import * as d3 from 'd3';
  
  const svgContainer = ref(null);
  const tooltip = ref(null);
  const selectedAminoAcid = ref('');
  const parsedData = ref([]);
  const filteredData = ref([]);
  
  const aminoAcids = [
    "R", "K", "H", "D", "E", "Q", "N", "S", "T", "Y",
    "W", "F", "A", "I", "L", "M", "V", "G", "P", "C"
  ];
  
  onMounted(async () => {
    const response = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv');
    const data = await response.text();
    parsedData.value = d3.csvParse(data);
    filterData();
    updateHeatmap();
  });
  
  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      parsedData.value = d3.csvParse(reader.result);
      filterData();
      updateHeatmap();
    };
  
    reader.readAsText(file);
  }
  
  function filterData() {
    if (selectedAminoAcid.value) {
      filteredData.value = parsedData.value.filter(d => +d.site >= 71 && +d.site <= 602 && d.wildtype === selectedAminoAcid.value);
    } else {
      filteredData.value = parsedData.value.filter(d => +d.site >= 71 && +d.site <= 602);
    }
  }
  
  watch(selectedAminoAcid, () => {
    filterData();
    updateHeatmap();
  });

  function updateHeatmap() {
  const svg = d3.select('#svgContainer');
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerHeight = height - margin.top - margin.bottom;

  const sites = [...new Set(filteredData.value.map(d => +d.site))];
  const squareSize = Math.min(innerHeight / aminoAcids.length, 20);
  const innerWidth = squareSize * sites.length;
  const width = innerWidth + margin.left + margin.right;
  
  const yScale = d3.scaleBand()
  .domain(amino_acids)
  .range([0, innerHeight])
  .padding(0.01);

  let colorScale = d3.scaleDiverging(d3.interpolateRdBu)
    .domain([-4, 0, 4]);

  const xScale = d3.scaleBand()
    .domain(sites)
    .range([0, innerWidth])
    .padding(0.01);

  svg.selectAll('*').remove();

  const svgElement = svg.append('svg')
    .attr('width', width)
    .attr('height', height)
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
    .attr('stroke-width', 0.5)
    .on('mouseover', function(event, d) {
      const dataPoint = filteredData.find(dp => +dp.site === d.site && dp.mutant === d.mutant);
      let tooltipText = '';
      if (dataPoint) {
        tooltipText = `Site: ${d.site}, Mutant: ${d.mutant}, Value: ${dataPoint.entry_CHO_bEFNB2}`;
      } else {
        const wildtypePoint = filteredData.find(dp => +dp.site === d.site && dp.wildtype === d.mutant);
        if (wildtypePoint) {
          tooltipText = `Site: ${d.site}, Wildtype: ${d.mutant}`;
        } else {
          tooltipText = `Site: ${d.site}, Mutant: ${d.mutant}, Value: Missing`;
        }
      }
      const tooltip = d3.select('#tooltip');
      tooltip.text(tooltipText)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 90) + 'px')
        .style('opacity', 1);
    })
    .on('mouseout', function() {
      const tooltip = d3.select('#tooltip');
      tooltip.style('opacity', 0);
    });

  svgElement.selectAll('.wildtype')
    .data(filteredData)
    .join('text')
    .attr('class', 'wildtype')
    .attr('x', d => xScale(+d.site) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d.wildtype) + yScale.bandwidth() / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', '8px')
    .attr('font-weight', '100')
    .attr('fill', 'black')
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
    .attr('dx', '-0.8em')
    .attr('dy', '-0.5em');

  svgElement.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).tickSizeOuter(0));
}

// Listen for changes in the dropdown selection
d3.select('#wildtypeSelect').on('change', function() {
  const selectedAminoAcid = this.value;
  if (selectedAminoAcid) {
    filteredData = parsedData.filter(d => +d.site >= 71 && +d.site <= 602 && d.wildtype === selectedAminoAcid);
  } else {
    filteredData = parsedData.filter(d => +d.site >= 71 && +d.site <= 602);
  }
  updateHeatmap();
});

</script>