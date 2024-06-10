<template>
    <svg ref='svgContainer'></svg>
</template>

<script setup>
import * as d3 from 'd3';
import { onMounted, ref, onUnmounted, watchEffect } from 'vue';
import { parseNewick, scaleBranchLengths } from '/components/utilities/treeUtilities.js';

const dataset = ref(null);
const svgContainer = ref(null);

const width = 800;
const height = 600;

let svg = null;
let simulation = null;

const drag = simulation => {

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

function plotTree() {
    const tree = d3.cluster()
        .size([width, height])
        .separation(function separation(a, b) {
            return a.parent == b.parent ? 1 : 1;
        });

    const root = d3.hierarchy(dataset.value, d => d.branchset)
        .sum((d) => d.branchLength || 0)
        .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id));

    tree(root);

    scaleBranchLengths(root.descendants(), width);

    const countries = Array.from(new Set(root.descendants().map(d => d.data.country))).filter(Boolean)

    const colorScale = d3.scaleOrdinal()
        .domain(countries)
        .range(d3.schemeCategory10);

    const links = root.links();
    const nodes = root.descendants();

    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("center", d3.forceCenter().strength(0.6))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const link = svg.append("g")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.8)
        .selectAll("line")
        .data(links)
        .join("line");

    // Append nodes.
    const node = svg.append("g")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 2)
        .selectAll("circle")
        .data(nodes.filter(d => !d.children))
        .join("circle")
        .attr("fill", d => colorScale(d.data.country))
        .attr("stroke", "currentColor")
        .attr("r", 7)
        .call(drag(simulation));

    // Add the legend
    const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${-300}, ${-350})`);

    const legendItems = legend
        .selectAll('.legend-item')
        .data(countries)
        .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${(i + 5) * 25})`);

    legendItems
        .append('circle')
        .attr('cx', 0)
        .attr('cy', -45)
        .attr('r', 7)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 2)
        .attr('fill', (d) => colorScale(d));
    legendItems
        .append('text')
        .attr('class', 'text')
        .attr('x', 12)
        .attr('y', -40)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .attr('font-size', '14px')
        .text((d) => d);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    });
}

onMounted(() => {
    svg = d3.select(svgContainer.value)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr('viewBox', [-width / 2, -height / 2, width, height])
})

onUnmounted(() => {
    if (simulation) {
        simulation.stop(); // Stop the simulation if it exists
    }
});

watchEffect(() => {
    if (dataset.value) {
        plotTree();
    }
});

fetchData();
async function fetchData() {
    const file = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/data/custom_analyses_data/alignments/phylo/nipah_whole_genome_phylo.tre');
    const csv = await file.text();
    const parsedNewick = parseNewick(csv);
    dataset.value = parsedNewick;
}
</script>
