---
title: blah Antibody escape line plot animation
aside: false
date: 2024-06-06
keywords:
  - D3
subtext: anime
---

<template>
  <FigureTitle>{{$frontmatter.title}}</FigureTitle>
  <SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
  <D3PlotContainer class='bg-blue-500'>
    <svg ref='svgContainer'></svg>
  </D3PlotContainer>
  <button class='download-btn ' @click=downloadPNGHandler></button>
</template>

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
  const height = 400;
  const marginTop = 40;
  const marginRight = 40;
  const marginBottom = 60;
  const marginLeft = 60;

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dataFile = ref('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_antibody_escape.csv');

  async function fetchData() {
    const csv = await d3.csv(dataFile.value);
    const array = csv.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      escape: Math.max(0, +d.escape_mean),
      antibody: d.antibody,
    }));
    const groups = d3.rollup(array, (v) => d3.sum(v, (d) => d.escape), (d) => d.antibody, (d) => d.site);
    const antibodyData = Array.from(groups, ([antibody, siteData]) => ({
      antibody,
      sites: Array.from(siteData, ([site, escape]) => ({ site, escape })),
    }));
    dataset.value = antibodyData;
    console.log('data fetched')
  }

  fetchData();

  const xScale = computed(() => {
    return d3.scaleLinear()
      .domain(d3.extent(dataset.value[0].sites, (d) => d.site))
      .range([marginLeft, width-marginRight]);
  });

  const xAxisGenerator = computed(() => {
    return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
  });

  const yScale = computed(() => {
    return d3.scaleLinear()
      .domain([d3.min(dataset.value, (d) => d3.min(d.sites, (s) => s.escape)), d3.max(dataset.value, (d) => d3.max(d.sites, (s) => s.escape))])
      .range([height-marginBottom, marginTop]);
  });

  const yAxisGenerator = computed(() => {
    return d3.axisLeft().scale(yScale.value).ticks(6).tickSizeOuter(0);
  });

  const lineGenerator = computed(() => {
    return d3.line()
      .x(d => xScale.value(d.site))
      .y(d => yScale.value(d.escape));
  });

  const points = computed(() => {
    return dataset.value.flatMap(d => d.sites.map(s => [xScale.value(s.site), yScale.value(s.escape), d.antibody]));
  });

  let svg;
  let path;
  let antibodies;
  let currentAntibodyIndex = -1;
  const loopInterval = 2000; // Adjust the interval duration as needed

  onMounted(() => {
    console.log('mounted')
    svg = d3.select(svgContainer.value)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('border', '1px solid black');
  });

  const colorScale = d3.scaleOrdinal().range(["#6929C4", "#1192e8", "#005d5d", "#9f1853", "#fa4d56","#570408"]);

  function makeColorChart() {
    console.log('making chart')
    path = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
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
        .text('Summed Escape'));

    
    antibodies = dataset.value.map(d => d.antibody);
    startLoop();
  }

  function startLoop() {
    console.log('starting loop')
    setInterval(() => {
      currentAntibodyIndex = (currentAntibodyIndex + 1) % (antibodies.length + 1);
      updateColors();
    }, loopInterval);
  }

  function updateColors() {
    console.log('updating colors')
    if (currentAntibodyIndex === 0) {
      path.style("stroke", d => colorScale(d.antibody));
    } else {
      const currentAntibody = antibodies[currentAntibodyIndex - 1];
      path.style("stroke", ({antibody: a}) => a === currentAntibody ? colorScale(a) : "#ddd");
    }
  }

  watchEffect(() => {
    if (dataset.value) {
      console.log('data changed')
      makeColorChart();
    }
  });
</script>