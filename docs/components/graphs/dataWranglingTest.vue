<template>
  <div class="relative inline-block text-left">
    <select
      class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      v-model="dataFile">
      <option v-for="option in dataOptions" :value="option.path">{{ option.name }}</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
  <div class="flex flex-col items-center font-ultralight">
    <svg ref="svgContainer"></svg>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import * as d3 from 'd3';
  import { Legend } from '/components/legend.js';


  const dataset = ref(null);
  const svgContainer = ref(null);

  const width = 500;
  const height = 400;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 60;
  const marginLeft = 60;

  const circleRadius = 4;

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dataOptions = [
    {
      path: 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_bEFNB2_binding.csv',
      name: 'CHO bEFNB2 Binding'
    },
    {
      path: 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv',
      name: 'CHO bEFNB3 Entry'
    }
  ];
  const dataFile = ref('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_bEFNB2_binding.csv')

  const color = computed(() => {
    if (dataFile.value === 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_bEFNB2_binding.csv') {
      return 'steelblue';
    } else {
      return 'indianred';
    }
  });

  watch(dataFile, () => {
    fetchData();
  });

  async function fetchData() {
    let string;
    if (dataFile.value === 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_bEFNB2_binding.csv')
      string = 'bEFNB2_binding';
    else {
      string = 'entry_CHO_bEFNB3';
    }
    console.log(string)
    const response = await fetch(dataFile.value);
    const file_text = await response.text();
    const csv = d3.csvParse(file_text);
    const array = csv.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      entry: +d[string],
    }));

    const groups = d3.group(array, (d) => d.site);
    const meanData = Array.from(groups, ([site, siteData]) => ({
      site,
      entry: parseFloat(d3.mean(siteData, (d) => d.entry).toFixed(2)),
    }));
    dataset.value = meanData;
  }

  fetchData()

  const xScale = computed(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(dataset.value, d => d.site))
      .range([0, innerWidth])
      .nice();
  });

  const yScale = computed(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(dataset.value, d => d.entry))
      .range([innerHeight, 0])
      .nice();
  });

  const xAxisGenerator = computed(() => {
    return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
  });

  const yAxisGenerator = computed(() => {
    return d3.axisLeft(yScale.value).tickSizeOuter(0);
  });

  let svg;
  onMounted(() => {
    svg = d3.select(svgContainer.value)
      //.attr('width', width)
      //.attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`);
  });

  function renderChart() {
    const t = 1000
    const circles = svg.selectAll('circle')
      .data(dataset.value, d => d.site)
      .join(
        enter => enter.append('circle')
          .attr('opacity', 0)
          .attr('cx', (d) => xScale.value(d.site))
          .attr('cy', (d) => yScale.value(d.entry))
          .attr('r', circleRadius)
          .attr('stroke', 'currentColor')
          .attr('fill', color)
          .transition()
          .duration(t)
          .attr('opacity', 1)
          .attr('fill', color.value),

        update => update
          .attr('r', circleRadius)
          .attr('stroke', 'currentColor')

          .transition()
          .duration(t)
          .attr('cx', (d) => xScale.value(d.site))
          .attr('cy', (d) => yScale.value(d.entry))
          .attr('fill', color.value),

        exit => exit
          .transition()
          .duration(t)
          .attr('opacity', 0)
          .remove()
      )

    // Update the x-axis
    const xAxis = svg.select('.x-axis');
    if (xAxis.empty()) {
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxisGenerator.value)
        .attr('font-size', '12px');
    } else {
      xAxis.transition().duration(1000)
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxisGenerator.value);
    }

    // Update the x-axis label
    const xAxisLabel = svg.select('.x-axis-label');
    if (xAxisLabel.empty()) {
      svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + marginBottom - 15)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Site');
    } else {
      xAxisLabel
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + marginBottom - 15);
    }

    // Update the y-axis
    const yAxis = svg.select('.y-axis');
    if (yAxis.empty()) {
      svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxisGenerator.value)
        .attr('font-size', '12px');
    } else {
      yAxis.transition().duration(1000)
        .attr('transform', 'translate(0, 0)')
        .call(yAxisGenerator.value);
    }

    // Update the y-axis label
    const yAxisLabel = svg.select('.y-axis-label');
    if (yAxisLabel.empty()) {
      svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -marginLeft + 15)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('Entry');
    } else {
      yAxisLabel
        .attr('x', -innerHeight / 2)
        .attr('y', -marginLeft + 15);
    }
  }

  watch(dataset, () => {
    renderChart()
  });

</script>