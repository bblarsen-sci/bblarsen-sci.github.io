<template>
    <div ref="svgContainer"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);

const width = 300;
const height = 100;
const marginTop = 10;
const marginRight = 20;
const marginBottom = 20;
const marginLeft = 20;

// Function to generate data points
function generateData(start, stop, numPoints) {
  const step = (stop - start) / (numPoints - 1);
  return Array.from({ length: numPoints }, (_, i) => ({
    x: start + i * step,
    y: 50,
  }));
}

// Generate initial data points
let data = generateData(0, 100, 11);

const x = d3.scaleLinear().domain([0, 100]).range([marginLeft, width - marginRight - marginLeft]);
const y = d3.scaleLinear().domain([0, 100]).range([height - marginBottom, marginTop]);
const color = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateViridis);

// Generate random coordinates for middle points
function generateRandomCoordinates() {
  const newData = [...data];
  for (let i = 1; i < data.length - 1; i++) {
    newData[i] = {
      ...newData[i],
      y: Math.random() * 120,
    };
  }
  return newData;
}

// Create the SVG element
function createSvg() {
    const svg = d3
        .select(svgContainer.value)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', [0, 0, width, height])
        .append('g')
        .attr('transform', `translate(${marginLeft},${marginTop})`);
    return svg;
}

// Draw the plot
function makePlot(svg) {
    
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'currentColor')
    .attr('stroke-width', 1.5)
    .attr('d', d3.line().curve(d3.curveBasis)
        .x(d => x(d.x))
        .y(d => y(d.y)))
    
  const circles = svg.append('g')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'currentColor')
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('fill', d => color(d.y))
    .attr('stroke', 'currentColor')
    .attr('r', 3);
}

function updateCircle(svg) {
  svg.selectAll('circle')
    .data(data)
    .join('circle')
    .transition()
    .duration(1000)
    .ease(d3.easePolyInOut)
    .attr('cx', d => x(d.x))
    .attr('cy', d => y(d.y))
    .attr('fill', d => color(d.y))
    .attr('stroke', 'currentColor')
}

// Update the plot with new data
function updatePlot(svg) {
    svg.select('path')
        .datum(data)
        .join('path')
        .transition()
        .duration(1000)
        .ease(d3.easePolyInOut)
        .attr('d', d3.line().curve(d3.curveBasis) //MonotoneX
            .x(d => x(d.x))
            .y(d => y(d.y)))

}


// Run the code when the component is mounted
onMounted(() => {
  const svg = createSvg();
  makePlot(svg);

  // Start the transition loop
  setInterval(() => {
    data = generateRandomCoordinates();
    updateCircle(svg);

    // Add a pause before running updatePlot
    setTimeout(() => {
      updatePlot(svg);
    }, 1000); // Adjust the delay as needed (in milliseconds)

  }, 3000);
});
</script>