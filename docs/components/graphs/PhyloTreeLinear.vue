<template>
    <input type="checkbox" id="toggleNames" v-model="showNames" />
    <label class="ml-2 align-middle" for="toggleNames">Show Taxa Names</label>
    <svg ref='svgContainer'></svg>
    <button class='download-btn' @click=downloadPNG(svgContainer)></button>
</template>

<script setup>
import * as d3 from 'd3';
import { onMounted, ref, computed, watchEffect,watch } from 'vue';
import { parseNewick, projection, diagonal, scaleBranchLengths } from '/components/utilities/treeUtilities.js';
import downloadPNG from '/components/utilities/downloadPNG.js'

const dataset = ref(null);
const svgContainer = ref(null)
const showNames = ref(false);

const radius = 4;
const margin = { top: 20, right: 20, bottom: 40, left: 20 };
const width = 500;
const height = 500;
let svg = null;


const tree = computed(() =>
    d3.cluster()
        .size([height - margin.top - margin.bottom, width - margin.right - margin.left])
        .separation(function separation(a, b) {
            return a.parent == b.parent ? 1 : 1;
        })
);

const root = computed(() =>
    d3.hierarchy(dataset.value, d => d.branchset)
        .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id))
        .sum((d) => d.branchLength || 0)
);

const countries = computed(() =>
    Array.from(new Set(root.value.descendants().map(d => d.data.country))).filter(Boolean)
);

const colorScale = computed(() =>
    d3.scaleOrdinal()
        .domain(countries.value)
        .range(d3.schemeCategory10)
);

function makeFigure() {
    tree.value(root.value);
    scaleBranchLengths(root.value.descendants(), width);

    const links = svg.append('g')
        .attr('class', 'links')
        .attr('fill', 'none')
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.25)

    links.selectAll('path')
        .data(root.value.links())
        .join(
            enter => enter.append('path')
                .attr('d', diagonal),
            update => update,
            exit => exit.remove()
        );

    const nodes = svg.append('g')
        .attr('class', 'nodes')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 1.25)
        .attr('stroke', 'currentColor')

    nodes.selectAll('circle')
        .data(root.value.descendants().filter(d => !d.children))
        .join(
            enter => enter
                .append('circle')
                .attr("fill", d => colorScale.value(d.data.country))
                .attr('transform', d => `translate(${d.y},${d.x})`)
                .attr('r', radius),
            update => update,
            exit => exit.remove()
        );

    //Add taxa labels
    const taxaLabels = svg.append('g')
        .attr('class', 'taxaLabels');

    function updateTaxaLabels() {
        taxaLabels.selectAll('text')
            .data(root.value.leaves())
            .join(
                enter => enter.append('text')
                    .attr('dy', '2px')
                    .attr('dx', '5px')
                    .attr('transform', d => `translate(${d.y},${d.x})`)
                    .text(d => d.data.name.replace(/['\.]/g, ""))
                    .attr('font-size', '5px')
                    .attr('text-anchor', 'start')
                    .attr('fill', 'currentColor')
                    .attr('text-align', 'left'),
                update => update,
                exit => exit.remove()
            )
            .attr('visibility', showNames.value ? 'visible' : 'hidden');
    }

    watchEffect(() => {
        updateTaxaLabels();
    });

    //Add legend
    const legendGroup = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${margin.left + 200}, ${margin.top})`);

    const legendItems = legendGroup.selectAll('.legend-item')
        .data(colorScale.value.domain())
        .join('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(10, ${i * 20})`);

    legendItems.append('circle')
        .attr('r', radius)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.25)
        .attr('fill', colorScale.value)

    legendItems.append('text')
        .attr('x', 8)
        .attr('y', 1)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', '12px')
        .text(d => d);

    const scaleBarLength = 0.1; // Adjust the length of the scale bar as needed
    const scaleBarGroup = svg.append('g')
        .attr('class', 'scale-bar')
        .attr('transform', `translate(${width - 150}, ${height-70})`);

    scaleBarGroup.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', scaleBarLength * (width - margin.right - margin.left))
        .attr('y2', 0)
        .attr('stroke', 'currentColor')
        .attr('stroke-width', 1.25);

    scaleBarGroup.append('text')
        .attr('x', scaleBarLength * (width - margin.right - margin.left) / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', '12px')
        .text(`${scaleBarLength} substitutions per site`);
}

onMounted(() => {
    svg = d3.select(svgContainer.value)
        .attr('viewBox', [0, 0, width, height])
        .append("g")
        .attr("transform", `translate(${margin.left - 200}, ${margin.top})`);
});

watch(dataset,() => {
        makeFigure()
});

fetchData()

async function fetchData() {
    const file = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/data/custom_analyses_data/alignments/phylo/nipah_whole_genome_phylo.tre');
    const csv = await file.text();
    dataset.value = parseNewick(csv);
}
</script>
