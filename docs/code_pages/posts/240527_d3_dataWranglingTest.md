---
layout: page
title: Data wrangling and effects of mutations from DMS data
aside: false
date: 2024-05-28
keywords:
- D3
subtext: Toggle between four types of DMS data in scatterplot with D3
thumbnail: /thumbnails/data_wrangling.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
  <select v-model="selectedDataset" @change="changeDataset">
    <option value="bEFNB2_entry">bEFNB2 Entry</option>
    <option value="bEFNB3_entry">bEFNB3 Entry</option>
    <option value="bEFNB2_binding">bEFNB2 Binding</option>
    <option value="bEFNB3_binding">bEFNB3 Binding</option>
  </select>
  <div class="flex flex-col items-center font-ultralight">
    <svg ref="svgContainer"></svg>
  </div>
  <Tooltip ref="tooltip" />
</D3PlotContainer>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import * as d3 from 'd3';
  import { Legend } from '/components/legend.js';
  import Tooltip from '/components/tooltip.vue';



  const dataset = ref(null);
  const dataset1 = ref(null);
  const svgContainer = ref(null);
  const processedData = ref({});
  const tooltip = ref(null);

  const width = 600;
  const height = 350;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 60;
  const marginLeft = 60;

  const circleRadius = 3;

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dataSources = [
    { dataKey: 'bEFNB2_entry', rawURL: 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB2.csv' },
    { dataKey: 'bEFNB3_entry', rawURL: 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv' },
    { dataKey: 'bEFNB2_binding', rawURL: 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_bEFNB2_binding.csv' },
    { dataKey: 'bEFNB3_binding', rawURL: 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_bEFNB3_binding.csv' },

  ];

  const selectedDataset = ref('bEFNB2_entry');

  function changeDataset() {
    dataset.value = processedData.value[selectedDataset.value];
  }

  // fetch remote data with a given name and URL using d3.csv
  async function fetchData(dataKey, rawURL) {
    try {
      const data = await d3.csv(rawURL);
      return { dataKey, data };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // load data from multiple sources and process it
  async function loadData(dataSources) {
    try {
      const fetchPromises = dataSources.map(({ dataKey, rawURL }) => fetchData(dataKey, rawURL));
      const fetchedDataArray = await Promise.all(fetchPromises);

      fetchedDataArray.forEach(({ dataKey, data }) => {
        processedData.value[dataKey] = processData(data);
      });

      selectedDataset.value = dataSources[0].dataKey; // Set the initial dataset
      dataset.value = processedData.value[selectedDataset.value];
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  // process the fetched data and return it
  function processData(fetchedData) {
    const array = fetchedData.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      entry: +Object.values(d)[3],
    }));
    const groups = d3.group(array, (d) => d.site);
    const meanData = Array.from(groups, ([site, siteData]) => ({
      site,
      entry: parseFloat(d3.sum(siteData, (d) => d.entry).toFixed(2)),
    }));
    return meanData;
  }

  // load the data and render the chart
  loadData(dataSources)
    .then(() => {
      dataset.value = processedData.value.bEFNB2_entry;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  watch(() => dataset.value, () => {
    renderChart();
  });

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


  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  function renderChart() {
    const circleColor = colorScale(selectedDataset.value);

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
          .attr('fill', circleColor)
          .on('mouseover', (event, d) => {
            const tooltipData = {
              site: d.site,
              wildtype: d.wildtype,
              mutant: d.mutant,
              effect: d.entry,
            };
            tooltip.value.data = tooltipData;
            //tooltip.value.color = 'white';
            tooltip.value.showTooltip(event);
          })
          .on('mouseout', () => {
            tooltip.value.hideTooltip();
          })
          .transition()
          .duration(t)
          .attr('opacity', 1)
          .attr('fill', circleColor),

        update => update
          .attr('r', circleRadius)
          .attr('stroke', 'currentColor')

          .transition()
          .duration(t)
          .attr('cx', (d) => xScale.value(d.site))
          .attr('cy', (d) => yScale.value(d.entry))
          .attr('fill', circleColor),

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
      xAxis.transition()
        .duration(t)
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
      yAxis.transition()
        .duration(t)
        .attr('transform', 'translate(0, 0)')
        .call(yAxisGenerator.value);
    }

    // Update the y-axis label
    const yAxisLabel = svg.select('.y-axis-label');
    const yAxisLabelText = selectedDataset.value.includes('binding') ? 'Mean Binding' : 'Mean Entry';
    if (yAxisLabel.empty()) {
      svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -marginLeft + 15)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text(yAxisLabelText);
    } else {
      yAxisLabel
        .attr('x', -innerHeight / 2)
        .attr('y', -marginLeft + 15)
        .text(yAxisLabelText);
    }
  }



</script>

<style scoped>
  select {
    padding: 8px 12px;
    font-size: 14px;
    border: 2px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    outline: none;
  }

  select:focus {
    border-color: #888;
  }
</style>