---
title: D3 phylogeny
aside: false
date: 2024-04-28
keywords:
    - D3
subtext: How to plot a phylogeny with D3
---

<script setup>
import PhylogeneticTree from "/components/graphs/PhylogeneticTree.vue";
</script>

# {{$frontmatter.title}}
{{$frontmatter.subtext}}

## Nipah phylogeny

<PhylogeneticTree/>
<div style="text-align: center; color: grey; font-size: smaller">Phylogeny of Nipah colored by country of origin. Based on whole genome sequences.</div>

## D3 circular tree
The code for making the tree is in ```/components/PhylogeneticTree.vue```. 

To visualize, I import the ```.vue``` script into a markdown file with the following code:

```html
<script setup>
import PhylogeneticTree from "./components/PhylogeneticTree.vue";
</script>

<PhylogeneticTree/>
```

The actual script ```PhylogeneticTree.vue``` contains some html with tailwind CSS to inject D3 into the ```svgContainer```.

```html
<template>
  <div class="flex flex-col justify-center items-center ">
  <div ref="svgContainer"></div>
  </div>
</template>
```
I made a maximum likelihood tree using IQ-Tree, and added country info to each taxon. Here is an example of what the tree .newick format looks like.

```
((('OM135495.1'[India]:0.0052953671000000035,((('MN549402.1'[India]:0.003601001100000001,...
```

Which shows the taxon name, the country, and the branch lengths. To parse the newick tree, I used javascript to read the string into a JSON object with a function written by [Jason Davies](https://github.com/jasondavies/newick.js/blob/master/src/newick.js){target="_self"}. I added a slight modification to get the country information for the tree.

```js
parseNewick(a) {
    for (var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0; t < s.length; t++) {
        var n = s[t];
        switch (n) {
            case "(":
                var c = {};
                r.branchset = [c];
                e.push(r);
                r = c;
                break;
            case ",":
                var c = {};
                e[e.length - 1].branchset.push(c);
                r = c;
                break;
            case ")":
                r = e.pop();
                break;
            case ":":
                break;
            default:
                var h = s[t - 1];
                if (h === ")" || h === "(" || h === ",") {
                    const nameAndCountry = n.split(/\[|\]/);
                    r.name = nameAndCountry[0];
                    r.country = nameAndCountry[1]; // Extract the country information
                } else if (h === ":") {
                    r.length = parseFloat(n);
                }
        }
    }
    return r;
},
```

Then, I load the tree data, parse it, and call the plot function.

```js
async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedData = parseNewick(csv); 
  drawChart(parsedData); 
};
```

The actual plotting function is a recursive function that plots the tree. Most of this code was [taken from the excellent example](https://observablehq.com/@d3/tree-of-life?intent=fork){target="_self"} by Mike Bostock. 

First, setup the chart.
```js
drawChart(parsedData) {
  const width = 800;
  const outerRadius = width / 2;
  const innerRadius = outerRadius - 120;

  const root = d3.hierarchy(parsedData, d => d.branchset)
    .sum(d => d.branchset ? 0 : 1)
    .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length));

  var cluster = d3.cluster()
    .size([360, innerRadius])
    .separation((a, b) => 1);
```
Functions to help build the circular tree.
```js
  // Tree building functions
  function maxLength(d) {
    return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
  }

  function setRadius(d, y0, k) {
    d.radius = (y0 += d.data.length) * k;
    if (d.children) d.children.forEach(d => setRadius(d, y0, k));
  }

  function linkStep(startAngle, startRadius, endAngle, endRadius) {
    const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
    const s0 = Math.sin(startAngle);
    const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
    const s1 = Math.sin(endAngle);
    return "M" + startRadius * c0 + "," + startRadius * s0
      + (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1)
      + "L" + endRadius * c1 + "," + endRadius * s1;
  }

  function linkConstant(d) {
    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
  }

  cluster(root);
  setRadius(root, root.data.length = 0, innerRadius / maxLength(root));
```

Setup the SVG and plot the tree with D3.
```js
  // Initialize SVG
  const svg = d3.select(this.$refs.svgContainer)
    .append('svg')
    .attr('width', width)
    .attr('height', width)
    .attr("viewBox", [-outerRadius, -outerRadius, width, width])
    .attr("class", "max-w-full h-auto");

  svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", linkConstant)
    .attr("stroke-width", 1);
```

In the original example, the tips of tree did not have circles. I wanted to include circles so added this:
```js
svg.append("g")
    .selectAll("circle")
    .data(root.leaves())
    .join("circle")
        .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius + 4},0)`)
        .attr("r", 6)
        .attr("stroke", "currentColor")
        .attr("stroke-width", 2)
        .attr("fill", d => {
        const countryColors = {
            "India": "#ff7f0e",
            "Bangladesh": "#1f77b4",
            "Malaysia": "#2ca02c",
            "Cambodia": "#d62728",
            "Thailand": "#9467bd",
        };
        return countryColors[d.data.country] || "black";
        });
```
Also, setup a custom legend
```js
// Legend setup
const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${outerRadius - 750}, ${-outerRadius + 90})`);

const legendItems = legend.selectAll(".legend-item")
    .data(Object.entries(countryColors))
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

legendItems.append("circle")
    .attr("r", 6)
    .attr("fill", d => d[1]);

legendItems.append("text")
    .attr("x", 10)
    .style("fill", "currentColor")
    .attr("y", 6)
    .attr("dy", "0em")
    .text(d => d[0]);
```

I use this ```vue.js``` function to run all the code once the DOM has been mounted:

```js
onMounted(() => {
  fetchData();
});
```

And here is the final tree again. 

<PhylogeneticTree/>