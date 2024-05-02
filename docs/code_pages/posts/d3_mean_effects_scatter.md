---
title: D3 Mean Mutation Effects
aside: false
date: 2024-04-27
keywords:
    - D3
    - Javascript Data Wrangling
subtext: How to make a simple plot with D3
---

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

<script setup>
import BaseChart from "/components/graphs/BaseChart.vue";
</script>

# Mean effects of mutations on cell entry

<BaseChart/>
<div style="text-align: center; color: grey; font-size: smaller">Mean effects of mutations on cell entry at each site for the Nipah virus receptor binding protein.</div>


## How to make the chart with ```Vue.js```

I use a ```Vue``` lifecycle hooks to load the data and plot the chart. Also, I load the data in from a remote repo.

```js
import * as d3 from 'd3';

export default {
  name: 'MeanEffectPlot',
  data() {
    return {
      dataset: []
    };
  },
  mounted() {
    this.loadCsvData();
  },
  methods: {
    loadCsvData() {
      d3.csv('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/entry/e2_e3_entry_filter_concat.csv').then(data => {
        this.dataset = data;
        this.createChart();
      }).catch(error => {
        console.error('Error loading the CSV file: ', error);
      });
    },
```
Setup the chart dimensions
```js
createChart() {
// Setup the dimensions of the chart
const width = 640;
const height = 400;
const marginTop = 50;
const marginRight = 50;
const marginBottom = 60;
const marginLeft = 60;

// Main SVG element
const svg = d3.select(this.$refs.svgContainer)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr("viewBox", [0, 0, width, height]);
```

The data from the .csv is grouped by site and the mean effect is calculated. 
```js
// Group data by site and calculate mean effect
const dataBySite = d3.group(this.dataset, d => d.site);
const meanEffects = Array.from(dataBySite, ([site, effects]) => ({
    site: parseInt(site),
    meanEffect: d3.mean(effects, d => parseFloat(d.effect))
    }));
```

Setup axes
```js
// Scale setup
const x = d3.scaleLinear()
    .domain([d3.min(meanEffects, d => d.site), d3.max(meanEffects, d => d.site)])
    .range([marginLeft, width - marginRight]);
    

const y = d3.scaleLinear()
        .domain([d3.min(meanEffects, d => d.meanEffect), d3.max(meanEffects, d => d.meanEffect)])
        .range([height - marginBottom, marginTop]);
```
Setup x-axis ticks and add label
```js 
// Add x-axis
svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('d')))
    .style('font-size', '14px')
    .call((g) => g.append("text")
        .attr("x", width / 2)
        .attr("y", marginBottom - 15)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Site")
        .style("font-size", "16px"));
```
Setup y-axis ticks and add label.
```js
svg.append('g')
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .style('font-size', '14px')
    .call((g) => g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -marginLeft + 15)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Mean Effect")
        .style("font-size", "16px"));
```
Plot the mean effects as circles
```js
// Plot mean effects as circles
svg.selectAll(".mean-effect-dot")
    .data(meanEffects)
    .enter().append("circle")
    .attr("class", "mean-effect-dot")
    .attr("cx", d => x(d.site))
    .attr("cy", d => y(d.meanEffect))
    .attr("r", 3)
    .attr("fill", "currentColor");
```

And the chart one more time
<BaseChart/>