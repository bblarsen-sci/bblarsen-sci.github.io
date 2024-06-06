---
title: Letters
aside: false
date: 2024-06-05
keywords:
  - D3
subtext: try letters
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


import downloadPNG from '/components/downloadPNG.js'
function downloadPNGHandler() {
  downloadPNG(svgContainer.value)
}

  const dataset = ref(null);
  const svgContainer = ref(null);

  const width = 600;
  const height = 400;
  const marginTop = 40;
  const marginRight = 20;
  const marginBottom = 80;
  const marginLeft = 20;

  let domains = [
  { start: 0, stop: 1, name: 'A', index: 1 },
  { start: 0, stop: 2, name: 'L', index: 2 },
  { start: 0, stop: 5, name: 'F', index: 3 },
];

  const xScale = computed(() => {
    return d3.scaleBand()
      .domain(domains.map(d => d.index))
      .range([marginLeft, width - marginRight])
      .padding(0.1)
  });

  const xAxisGenerator = computed(() => {
    return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
  });

    const yScale = computed(() => {
        return d3.scaleLinear()
        .domain([0, d3.max(domains, d => d.stop)])
        .range([height - marginBottom, marginTop])
        .nice()
    });



  let svg;
  onMounted(() => {
    svg = d3.select(svgContainer.value)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`);

    svg.append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(domains)
    .join('rect')
    .attr('x', d => xScale.value(d.index))
    .attr('y', d => yScale.value(d.stop))
    .attr('height', d => yScale.value(d.start) - yScale.value(d.stop))
    .attr('width', xScale.value.bandwidth())
    .attr('text', d => d.name)

    svg.append('g')
    .attr('transform', `translate(0, ${height - marginBottom})`)
    .call(xAxisGenerator.value)

    svg.append('g')
    .attr('transform', `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(yScale.value).ticks(3))
    
  });

  
</script>


