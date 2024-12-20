<template>
    <svg ref='svgContainer'></svg>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);

const width = 300;
const height = 100;
const marginTop = 10;
const marginRight = 10;
const marginBottom = 10;
const marginLeft = 10;

// Function to generate data points
function generateData(start, stop, numPoints) {
    const step = (stop - start) / (numPoints - 1);
    return Array.from({ length: numPoints }, (_, i) => ({
        x: start + i * step,
        y: height / 2,
    }));
}

// Generate initial data points
let data = generateData(0, width, 10);

const x = d3.scaleLinear().domain([0, width]).range([marginLeft, width - marginRight - marginLeft]);
const y = d3.scaleLinear().domain([0, height]).range([height - marginBottom, marginTop]);

const color = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateViridis);

// Generate random coordinates for middle points
function generateRandomCoordinates() {
    const newData = [...data];
    for (let i = 1; i < data.length - 1; i++) {
        newData[i] = {
            ...newData[i],
            y: Math.random() * height,
        };
    }
    return newData;
}

// Create the SVG element
function createSvg() {
    const svg = d3
        .select(svgContainer.value)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', [0, 0, width, height])
    return svg;
}

// Update the path element
function updatePath(svg) {
    svg.selectAll('path')
        .data([data])
        .join(
            enter => enter.append('path')
                .attr('mix-blend-mode', 'multiply')
                .attr('fill', 'none')
                .attr('stroke', 'currentColor')
                .attr('stroke-width', 1.5)
                .attr('d', d3.line().curve(d3.curveBasis)
                    .x(d => x(d.x))
                    .y(d => y(d.y))),
            update => update
                .transition()
                .duration(1000)
                .attr('d', d3.line().curve(d3.curveBasis)
                    .x(d => x(d.x))
                    .y(d => y(d.y))),
            exit => exit.remove()
        );
}
// Update the circle elements
function updateCircle(svg) {
    svg.selectAll('circle')
        .data(data)
        .join(
            enter => enter.append('circle')
                .attr('mix-blend-mode', 'multiply')
                .attr('cx', d => x(d.x))
                .attr('cy', d => y(d.y))
                .attr('r', 3)
                .attr('fill', d => color(d.y))
                .attr('stroke', 'currentColor'),
            update => update
                .transition()
                .duration(1000)
                .attr('fill', d => color(d.y))
                .attr('cx', d => x(d.x))
                .attr('cy', d => y(d.y)),
            exit => exit.remove()
        )
}

onMounted(() => {
    const svg = createSvg();
    updatePath(svg);
    updateCircle(svg);
    setInterval(() => {
        data = generateRandomCoordinates();
        updateCircle(svg);
        setTimeout(() => {
            updatePath(svg);
        }, 1000);
    }, 3000);
});
</script>
