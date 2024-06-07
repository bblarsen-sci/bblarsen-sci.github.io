---
title: Antibody escape line plot animation
date: 2024-06-06
keywords:
  - D3
subtext: Animate between the different antibodies with transition
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
  import downloadPNG from '/components/downloadPNG.js';
  
  function downloadPNGHandler() {
    downloadPNG(svgContainer.value);
  }

  const dataset = ref(null);
  const svgContainer = ref(null);

  const width = 800;
  const height = 400;
  const marginTop = 40;
  const marginRight = 40;
  const marginBottom = 60;
  const marginLeft = 60;

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dataFile = ref('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_antibody_escape.csv');

  /**
   * Asynchronously fetches data from a CSV file and processes it to create a dataset for visualization.
   * @returns {void}
   */
  async function fetchData() {
    // Fetch the CSV data
    const csv = await d3.csv(dataFile.value);

    // Process the CSV data into an array of objects
    const array = csv.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      escape: Math.max(0, +d.escape_mean),
      antibody: d.antibody,
    }));

    // Group the data by antibody, then by site, and calculate the mean escape value for each site
    const groups = d3.rollup(array, (v) => d3.mean(v, (d) => d.escape), (d) => d.antibody, (d) => d.site);

    // Convert the grouped data into a format suitable for visualization
    const antibodyData = Array.from(groups, ([antibody, siteData]) => ({
      antibody,
      sites: Array.from(siteData, ([site, escape]) => ({ site, escape })),
    }));

    // Set the dataset value to the processed data
    dataset.value = antibodyData;
  }

  // Call the fetchData function to fetch and process the data
  fetchData();

  /**
   * Computed property for the x-scale of the visualization.
   * @returns {d3.scaleLinear} The x-scale function.
   */
  const xScale = computed(() => {
    return d3.scaleLinear()
      .domain(d3.extent(dataset.value[0].sites, (d) => d.site))
      .range([marginLeft, width - marginRight]);
  });

  /**
   * Computed property for the x-axis generator of the visualization.
   * @returns {d3.axisBottom} The x-axis generator.
   */
  const xAxisGenerator = computed(() => {
    return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
  });

  /**
   * Computed property for the y-scale of the visualization.
   * @returns {d3.scaleLinear} The y-scale function.
   */
  const yScale = computed(() => {
    return d3.scaleLinear()
      .domain([d3.min(dataset.value, (d) => d3.min(d.sites, (s) => s.escape)), d3.max(dataset.value, (d) => d3.max(d.sites, (s) => s.escape))])
      .range([height - marginBottom, marginTop]);
  });

  /**
   * Computed property for the y-axis generator of the visualization.
   * @returns {d3.axisLeft} The y-axis generator.
   */
  const yAxisGenerator = computed(() => {
    return d3.axisLeft().scale(yScale.value).ticks(6).tickSizeOuter(0);
  });

  /**
   * Computed property for the line generator of the visualization.
   * @returns {d3.line} The line generator.
   */
  const lineGenerator = computed(() => {
    return d3.line()
      .x(d => xScale.value(d.site))
      .y(d => yScale.value(d.escape));
  });

  /**
   * Computed property for the array of points to be plotted in the visualization.
   * @returns {Array} The array of points, each represented as [x, y, antibody].
   */
  const points = computed(() => {
    return dataset.value.flatMap(d => d.sites.map(s => [xScale.value(s.site), yScale.value(s.escape), d.antibody]));
  });

  let svg;
  let path;
  let antibodies;
  let currentAntibodyIndex = -1;
  const loopInterval = 2000; // Adjust the interval duration as needed
  let antibodyText;

  onMounted(() => {
    svg = d3.select(svgContainer.value)
      .attr('viewBox', `0 0 ${width} ${height}`)
  });


  const colorScale = d3.scaleOrdinal().range(d3.schemeTableau10);

  function makeColorChart() {
    path = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 1.75)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(dataset.value)
      .join('path')
      .attr('d', (d) => lineGenerator.value(d.sites))
      .attr('stroke', (d) => colorScale(d.antibody))
      .attr('mix-blend-mode', 'multiply');

    svg.append('g')
      .attr('transform', `translate(0, ${height-marginBottom})`)
      .call(xAxisGenerator.value)
      .attr('font-size', '15px')
      .call(g => g.selectAll('.domain').remove())
      .call(g => g.selectAll('.tick line').clone()
        .attr('y2', -height + marginBottom)
        .attr('stroke-opacity', 0.1))
      .call(g => g.append('text')
        .attr('x', width/2)
        .attr('y', marginBottom-20)
        .attr('font-size', '18px')
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Site'));

    svg.append('g')
      .attr('transform', `translate(${marginLeft}, 0)` )
      .call(yAxisGenerator.value)
      .attr('font-size', '15px')
      .call(d => d.selectAll('.domain').remove())
      .call(g => g.append('text')
        .attr('x', -height/2)
        .attr('y', -marginLeft + 20)
        .attr('font-size', '18px')
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'middle')
        .text('Mean Escape'));


    antibodyText = svg.append("text")
      .attr("x", width - marginRight)
      .attr("y", marginTop)
      .attr("text-anchor", "end")
      .attr('font-weight', 'bold')
      .attr("font-size", "18px")


    antibodies = dataset.value.map(d => d.antibody);
    startLoop();
  }

  /**
   * Starts a loop that updates the colors of the antibodies at a specified interval.
   */
  function startLoop() {
    setInterval(() => {
      currentAntibodyIndex = (currentAntibodyIndex + 1) % (antibodies.length + 1);
      updateColors();
    }, loopInterval);
  }

  /**
   * Updates the colors of the antibodies based on the current antibody index.
   */
  function updateColors() {
    if (currentAntibodyIndex === 0) {
      path.style("stroke", d => colorScale(d.antibody))
        .attr("stroke-width", 1.75);
    } else {
      const currentAntibody = antibodies[currentAntibodyIndex - 1];
      path.style("stroke", ({antibody: a}) => a === currentAntibody ? colorScale(a) : "#ddd")
        .attr("stroke-width", d => d.antibody === currentAntibody ? 2 : 1.75)
        .filter(({antibody: a}) => a === currentAntibody)
        .raise();
    }
    if (currentAntibodyIndex === 0) {
      antibodyText.text("");
    } else {
      const currentAntibody = antibodies[currentAntibodyIndex - 1];
      antibodyText.text(currentAntibody)
        .attr("fill", colorScale(currentAntibody));
    }
  }

  watchEffect(() => {
    if (dataset.value) {
      makeColorChart();
    }
  });
</script>
