<template>
    <svg ref='svgContainer'></svg>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const svgContainer = ref(null);

const width = 300;
const height = 100;

const generateDataset = () => (
    Array(20).fill(0).map(() => ([
        d3.randomNormal(width / 2, width / 6)(),
        d3.randomNormal(height / 2, height / 8)(),
    ]))
)

// Create the SVG element
function createSvg() {
    const svg = d3
        .select(svgContainer.value)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', [0, 0, width, height])
    return svg;
}

onMounted(() => {
    const svg = createSvg();
    update(svg)
    setInterval(() => { update(svg) }, 3000);
});

function update(svg) {
    // Generate a new random dataset
    const data = generateDataset();

    // Define the diverging color scale
    const colorScale = d3.scaleDiverging(d3.interpolateRdBu)
        .domain([0, width / 2, width])

    svg.selectAll("circle")
        .data(data)
        .join(
            enter => enter.append("circle")
                .attr("cx", d => d[0])
                .attr("cy", d => d[1])
                .transition()
                .duration(2000)
                .ease(d3.easePolyInOut)
                .attr('stroke', 'currentColor')
                .style('mix-blend-mode', 'multiply')
                .attr('stroke-width', 0.5)
                .attr("r", 5)
                .attr('fill', d => colorScale(d[0])),
            update => update
                .transition()
                .duration(2000)
                .ease(d3.easePolyInOut)
                .attr("cx", d => d[0])
                .attr("cy", d => d[1])
                .attr('fill', d => colorScale(d[0])),
            exit => exit
                .remove()
        )
}
</script>
