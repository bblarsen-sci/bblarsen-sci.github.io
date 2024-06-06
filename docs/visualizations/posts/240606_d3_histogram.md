---
title: Scatterplot comparing mean effects of mutations
aside: false
date: 2024-06-06
keywords:
  - D3
subtext: Comparison of effects on cell entry for bEFNB2 and bEFNB3
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<svg ref='svgContainer'></svg>
</D3PlotContainer>
<button class='download-btn ' @click=downloadPNGHandler></button>

<script setup>
  import { ref, computed, watch, onMounted, watchEffect } from 'vue';
  import * as d3 from 'd3';
  import { Legend } from '/components/legend.js';

  import downloadPNG from '/components/downloadPNG.js';
  function downloadPNGHandler() {
    downloadPNG(svgContainer.value);
  }

  const dataset = ref(null);
  const svgContainer = ref(null);

  const width = 800;
  const height = 800;
  const marginTop = 40;
  const marginRight = 40;
  const marginBottom = 100;
  const marginLeft = 100;

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dataFile = 'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/entry/e2_e3_entry_filter_merged.csv'

  /**
   * Asynchronously fetches data from a CSV file and processes it to create a dataset for visualization.
   * @returns {void}
   */
  async function fetchData() {
    // Fetch the CSV data
    const csv = await d3.csv(dataFile);

    // Process the CSV data into an array of objects
    const array = csv.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      effect_E2: +d.effect_E2,
      effect_E3: +d.effect_E3,
      wt_type: d.wt_type_E2,
    }))
    .filter((d) => d.effect_E2 !== 0 && d.effect_E3 !== 0);
    
    // Group the data by site and calculate the mean values
  const groupedData = d3.rollup(
    array,
    (v) => ({
      effect_E2: d3.mean(v, (d) => d.effect_E2),
      effect_E3: d3.mean(v, (d) => d.effect_E3),
      wt_type: v[0].wt_type, // Assuming wt_type is the same for all data points with the same site
    }),
    (d) => d.site
  );

  // Convert the grouped data back to an array
  const aggregatedData = Array.from(groupedData, ([site, values]) => ({
    site,
    ...values,
  }));
    // Set the dataset value to the processed data
    dataset.value = aggregatedData;
  }
  // Call the fetchData function to fetch and process the data
  fetchData();


  const xScale = computed(() => {
    return d3.scaleLinear()
      .domain(d3.extent(dataset.value, d => d.effect_E2))
      .range([marginLeft, width - marginRight]);
  });


  const xAxisGenerator = computed(() => {
    return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
  });

  const yScale = computed(() => {
    return d3.scaleLinear()
      .domain(d3.extent(dataset.value, d => d.effect_E3))
      .range([height - marginBottom, marginTop]);
  });

  const yAxisGenerator = computed(() => {
    return d3.axisLeft().scale(yScale.value).ticks(6).tickSizeOuter(0);
  });

  let svg;
  
  onMounted(() => {
    svg = d3.select(svgContainer.value)
      .attr('viewBox', `0 0 ${width} ${height}`)
  });

  const colorScale = computed(() => {
    return d3.scaleOrdinal(dataset.value.map(d => d.wt_type), d3.schemePaired);
  });



  function makeColorChart() {
    const highlightedSites1 = [239, 240, 241, 242, 305, 388, 389, 401, 402, 458, 488, 489, 490, 491, 492, 501, 504, 505, 506, 507, 530, 531, 532, 533, 555, 557, 558, 559, 579, 580, 581, 583, 588];
  const highlightedSites2 = [556, 528, 216, 404, 243, 584, 529, 554, 497, 502, 218, 403, 390, 503, 494, 560, 217, 487, 499, 589, 459, 304, 215, 351, 457, 500, 526, 302, 578, 508, 493, 438, 590, 441, 585, 582, 440, 534, 236, 400, 527, 214, 586, 237, 439, 306, 394, 495, 587, 405, 553, 387];

     // Add x-axis line at y=0
    svg.append('line')
      .attr('x1', xScale.value(d3.min(dataset.value, d => d.effect_E2)))
      .attr('y1', yScale.value(0))
      .attr('x2', xScale.value(d3.max(dataset.value, d => d.effect_E2)))
      .attr('y2', yScale.value(0))
      .attr('stroke', 'lightgray')
      .attr('stroke-width', 1.5);

    // Add y-axis line at x=0
    svg.append('line')
      .attr('x1', xScale.value(0))
      .attr('y1', yScale.value(d3.min(dataset.value, d => d.effect_E3)))
      .attr('x2', xScale.value(0))
      .attr('y2', yScale.value(d3.max(dataset.value, d => d.effect_E3)))
      .attr('stroke', 'lightgray')
      .attr('stroke-width', 1.5);
    


    svg.append('g')
    .selectAll('circle')
    .data(dataset.value)
    .join("circle")
    .attr("cx", d => xScale.value(d.effect_E2))
    .attr("cy", d => yScale.value(d.effect_E3))
    .attr("r", 6)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2)
    .attr("fill", d => {
      if (highlightedSites1.includes(d.site)) {
        return '#5778a4';
      } else if (highlightedSites2.includes(d.site)) {
        return '#e49444';
      } else {
        return '#b8b0ac';
      }
    })

    svg.append('g')
      .attr('transform', `translate(0, ${height-marginBottom})`)
      .call(xAxisGenerator.value)
      .attr('font-size', '14px')
      .call(g => g.append('text')
        .attr('x', (width/2) + 50)
        .attr('y', marginBottom-30)
        .attr('font-size', '20px')
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Entry in CHO-bEFNB2'));

    svg.append('g')
      .attr('transform', `translate(${marginLeft}, 0)` )
      .call(yAxisGenerator.value)
      .attr('font-size', '14px')
      .call(g => g.append('text')
        .attr('x', (-height/2) + 40)
        .attr('y', -marginLeft + 30)
        .attr('font-size', '20px')
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Entry in CHO-bEFNB3'));

       const legendData = [
        { color: '#b8b0ac', label: 'Distant' },
      { color: '#5778a4', label: 'Contact' },
      { color: '#e49444', label: 'Close' }
    ];

    // Create legend group
    const legend = svg.append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`);

    // Add legend header
    legend.append('text')
      .attr('x', 10)
      .attr('y', 75)
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', 'currentColor')
      .text('Receptor Distance');

    // Add legend items
    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .join('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 40})`);

    // Add colored circles to legend
    legendItems.append('circle')
      .attr('cx', 20)
      .attr('cy', 100)
      .attr('r', 10)
      .attr('fill', d => d.color)
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 2);

    // Add labels to legend
    legendItems.append('text')
      .attr('x', 35)
      .attr('y', 106)
      .attr('font-size', '20px')
        .attr('fill', 'currentColor')
      .text(d => d.label);
  }

  watchEffect(() => {
    if (dataset.value) {
      makeColorChart();
    }
  });
</script>


