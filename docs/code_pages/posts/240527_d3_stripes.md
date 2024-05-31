---
layout: doc
title: Gradient Stripes
aside: false
date: 2024-05-28
keywords:
  - D3
subtext: Map mean DMS data to a diverging color scale using D3.
thumbnail: /thumbnails/gradientStripes.png
---

<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
<svg></svg>
</D3PlotContainer>

<script setup>
  import { ref, computed, watch, onMounted, watchEffect } from 'vue';
  import * as d3 from 'd3';
  import { Legend } from '/components/legend.js';

  const dataset = ref(null);

  const width = 500;
  const height = 125;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 60;
  const marginLeft = 60;

  const circleRadius = 4;

  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  const dataFile = ref('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv')

  async function fetchData() {
    const csv = await d3.csv(dataFile.value);
    const array = csv.map((d) => ({
      site: +d.site,
      wildtype: d.wildtype,
      mutant: d.mutant,
      entry: +d.entry_CHO_bEFNB3,
    }));
    const groups = d3.group(array, (d) => d.site);
    const meanData = Array.from(groups, ([site, siteData]) => ({
      site,
      entry: parseFloat(d3.mean(siteData, (d) => d.entry).toFixed(2)),
    }));
    dataset.value = meanData;
  }

  const xScale = computed(() => {
    return d3.scaleLinear()
      .domain(d3.extent(dataset.value, d => d.site))
      .range([0, innerWidth])
  });

  const colorScale = computed(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(dataset.value, d => d.entry))
      .range([innerHeight, 0])
      .nice();
  });

  const xAxisGenerator = computed(() => {
    return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
  });

  const divergingColorScale = computed(() => {
    return d3.scaleDiverging(d3.interpolateRdBu)
      .domain([-4, 0, 1]);
  });

  let svg;
  onMounted(() => {
    svg = d3.select('svg')
      //.attr('width', width)
      //.attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${marginLeft}, ${marginTop})`);

        fetchData();

  });

  function makeColorChart() {

    const colorWidth = (innerWidth) / dataset.value.length;

    svg.selectAll('.color-rect')
      .data(dataset.value, d => d.site)
      .join(
        enter => enter.append('rect')
          .attr('class', 'color-rect')
          .attr('x', (d, i) => i * colorWidth)
          .attr('y', 0)
          .attr('width', colorWidth)
          .attr('height', innerHeight)
          .attr('fill', d => divergingColorScale.value(d.entry)),
        update => update
          .transition()
          .duration(2000)
          .attr('fill', d => divergingColorScale.value(d.entry)),
        exit => exit
          .remove()
      )
    const xAxis = svg.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxisGenerator.value)
      .attr('font-size', '12px');

    xAxis.append('text')
      .attr('class', 'text')
      .attr('x', (innerWidth) / 2)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text('Site');

    svg.append('text')
      //.attr('class', 'text')
      .attr('x', 0)
      .attr('y', -5)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .attr('font-size', '14px')
      .text('Mean Cell Entry');

    Legend(d3.scaleDiverging([-4, 0, 2], d3.interpolateRdBu).clamp(true), {
      width: 100,
      tickValues: [-4, 0, 2],
      xcoord: width-120,
      ycoord: 90,
    })
  }

  watchEffect(() => {
  if (dataset.value) {
    makeColorChart();
  }
});
</script>



<div class="!prose dark:!prose-dark">
<h2>HTML</h2>
<p> Code for making figure above as a vue single file component embedded in .md</p>
</div>

```html
<FigureTitle>{{$frontmatter.title}}</FigureTitle>
<SubtitleHeader>{{$frontmatter.subtext}}</SubtitleHeader>
<D3PlotContainer>
    <svg></svg>
</D3PlotContainer>
```

<div class="!prose dark:!prose-dark">
<h2>Javascript Vue</h2>
</div>


```vue
<script setup>
import { ref, computed, watch, onMounted, watchEffect } from 'vue';
import * as d3 from 'd3';
import { Legend } from '/components/legend.js'; //import legend

const dataset = ref(null); //make dataset a vue reactive variable 

//define plot dimensions
const width = 500;
const height = 125;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 60;
const marginLeft = 60;

const circleRadius = 4;

const innerWidth = width - marginLeft - marginRight;
const innerHeight = height - marginTop - marginBottom;

//URL for downloading data
const dataFile = ref('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_cell_entry_CHO-bEFNB3.csv')

//function to fetch data, change column names, then calculate average effect for each site
async function fetchData() {
  const csv = await d3.csv(dataFile.value);
  const array = csv.map((d) => ({
    site: +d.site,
    wildtype: d.wildtype,
    mutant: d.mutant,
    entry: +d.entry_CHO_bEFNB3,
  }));
  const groups = d3.group(array, (d) => d.site);
  const meanData = Array.from(groups, ([site, siteData]) => ({
    site,
    entry: parseFloat(d3.mean(siteData, (d) => d.entry).toFixed(2)),
  }));
  dataset.value = meanData;
}

//computed vue variable to calculate xScale anytime dataset updates
const xScale = computed(() => {
  return d3.scaleLinear()
    .domain(d3.extent(dataset.value, d => d.site))
    .range([0, innerWidth])
});
//computed vue variable to calculate yScale anytime dataset updates
const colorScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(d3.extent(dataset.value, d => d.entry))
    .range([innerHeight, 0])
    .nice();
});

//make xAxis
const xAxisGenerator = computed(() => {
  return d3.axisBottom().scale(xScale.value).tickSizeOuter(0);
});
//make yAxis
const divergingColorScale = computed(() => {
  return d3.scaleDiverging(d3.interpolateRdBu)
    .domain([-4, 0, 1]);
});
//select svg and add a viewbox to allow plot dimensions to change dynamically during window resize
let svg;
onMounted(() => {
  svg = d3.select('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${marginLeft}, ${marginTop})`);

      fetchData();

});

//main plotting function, primarily uses D3. Animations not used, but currently left in
function makeColorChart() {

  const colorWidth = (innerWidth) / dataset.value.length;

  svg.selectAll('.color-rect')
    .data(dataset.value, d => d.site)
    .join(
      enter => enter.append('rect')
        .attr('class', 'color-rect')
        .attr('x', (d, i) => i * colorWidth)
        .attr('y', 0)
        .attr('width', colorWidth)
        .attr('height', innerHeight)
        .attr('fill', d => divergingColorScale.value(d.entry)),
      update => update
        .transition()
        .duration(2000)
        .attr('fill', d => divergingColorScale.value(d.entry)),
      exit => exit
        .remove()
    )
  const xAxis = svg.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxisGenerator.value)
    .attr('font-size', '12px');

  xAxis.append('text')
    .attr('class', 'text')
    .attr('x', (innerWidth) / 2)
    .attr('y', 40)
    .attr('fill', 'currentColor')
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text('Site');

  svg.append('text')
    .attr('x', 0)
    .attr('y', -5)
    .attr('fill', 'currentColor')
    .attr('text-anchor', 'start')
    .attr('font-size', '14px')
    .text('Mean Cell Entry');

  Legend(d3.scaleDiverging([-4, 0, 2], d3.interpolateRdBu).clamp(true), {
    width: 100,
    tickValues: [-4, 0, 2],
    xcoord: width-120,
    ycoord: 90,
  })
}

//use vue lifecycle hook to monitor data, anytime it changes automatically update plot
watchEffect(() => {
if (dataset.value) {
  makeColorChart();
}
});

</script>
```



