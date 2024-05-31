<template>
  <div class="" ref="svgContainer"></div>
</template>

<script setup>
//some code based on example here: https://observablehq.com/@d3/tree-of-life?intent=fork
import * as d3 from 'd3';
import { onMounted, ref } from 'vue';

const svgContainer = ref(null);

function parseNewick(a) {
  for (var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0; t < s.length; t++) {
    var n = s[t];
    switch (n) {
      case '(':
        var c = {};
        r.branchset = [c];
        e.push(r);
        r = c;
        break;
      case ',':
        var c = {};
        e[e.length - 1].branchset.push(c);
        r = c;
        break;
      case ')':
        r = e.pop();
        break;
      case ':':
        break;
      default:
        var h = s[t - 1];
        if (h === ')' || h === '(' || h === ',') {
          const nameAndCountry = n.split(/\[|\]/);
          r.name = nameAndCountry[0];
          r.country = nameAndCountry[1]; // Extract the country information
        } else if (h === ':') {
          r.length = parseFloat(n);
        }
    }
  }
  return r;
}

function drawChart(data) {
  const width = 800;
  const outerRadius = width / 2;
  const innerRadius = outerRadius - 120;

  const root = d3
    .hierarchy(data, (d) => d.branchset)
    .sum((d) => (d.branchset ? 0 : 1))
    .sort((a, b) => a.value - b.value || d3.ascending(a.data.length, b.data.length));

  var cluster = d3
    .cluster()
    .size([360, innerRadius])
    .separation((a, b) => 1);

  // tree building functions
  function maxLength(d) {
    return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
  }
  function setRadius(d, y0, k) {
    d.radius = (y0 += d.data.length) * k;
    if (d.children) d.children.forEach((d) => setRadius(d, y0, k));
  }
  function linkStep(startAngle, startRadius, endAngle, endRadius) {
    const c0 = Math.cos((startAngle = ((startAngle - 90) / 180) * Math.PI));
    const s0 = Math.sin(startAngle);
    const c1 = Math.cos((endAngle = ((endAngle - 90) / 180) * Math.PI));
    const s1 = Math.sin(endAngle);
    return (
      'M' +
      startRadius * c0 +
      ',' +
      startRadius * s0 +
      (endAngle === startAngle
        ? ''
        : 'A' +
          startRadius +
          ',' +
          startRadius +
          ' 0 0 ' +
          (endAngle > startAngle ? 1 : 0) +
          ' ' +
          startRadius * c1 +
          ',' +
          startRadius * s1) +
      'L' +
      endRadius * c1 +
      ',' +
      endRadius * s1
    );
  }

  function linkConstant(d) {
    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
  }

  cluster(root);
  setRadius(root, (root.data.length = 0), innerRadius / maxLength(root));

  // Initialize SVG properly
  const svg = d3
    .select(svgContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', width)
    .attr('viewBox', [-outerRadius, -outerRadius, width, width])
    .attr('class', 'max-w-full h-auto');

  svg
    .append('g')
    .attr('class', 'stroke')
    .attr('fill', 'none')
    //.attr("stroke", "currentColor")
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr('d', linkConstant)
    .attr('stroke-width', 1.5);

  svg
    .append('g')
    .selectAll('circle')
    .data(root.leaves())
    .join('circle')
    .attr('transform', (d) => `rotate(${d.x - 90}) translate(${innerRadius + 4},0)`)
    .attr('r', 6)
    //.attr("stroke", "currentColor")
    //.attr("stroke-width", 2)
    .attr('class', 'circle')
    .attr('fill', (d) => {
      const countryColors = {
        India: '#ff7f0e',
        Bangladesh: '#1f77b4',
        Malaysia: '#2ca02c',
        Cambodia: '#d62728',
        Thailand: '#9467bd',
      };
      return countryColors[d.data.country] || 'black';
    });
  const countryColors = {
    India: '#ff7f0e',
    Bangladesh: '#1f77b4',
    Malaysia: '#2ca02c',
    Cambodia: '#d62728',
    Thailand: '#9467bd',
  };

  // Create a legend group
  const legend = svg
    .append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${outerRadius - 750}, ${-outerRadius + 90})`);

  // Add legend items
  const legendItems = legend
    .selectAll('.legend-item')
    .data(Object.entries(countryColors))
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * 20})`);

  // Add circles to legend items
  legendItems
    .append('circle')
    .attr('r', 6)
    .attr('fill', (d) => d[1])
    .attr('class', 'circle');
  //.attr("stroke", "currentColor")
  //.attr("stroke-width", 2);

  // Add country labels to legend items
  legendItems
    .append('text')
    .attr('class', 'legend-text')
    .attr('x', 10)
    .style('fill', 'currentColor')
    .attr('y', 6)
    .attr('dy', '0em')
    .text((d) => d[0]);
}

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedData = parseNewick(csv);
  drawChart(parsedData);
}
onMounted(() => {
  fetchData();
});
</script>

<style>
.circle {
  @apply stroke-white stroke-1 dark:stroke-slate-200;
}

.stroke {
  @apply stroke-current;
}
</style>
