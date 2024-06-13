<template>
    <svg ref="svgContainer"></svg>
</template>

<script setup>
import { ref, watch, onUnmounted, computed, onMounted } from 'vue';
import * as d3 from 'd3';
import { Legend } from '/components/utilities/legend.js';
import { useFetch } from '/components/composables/useFetch.js';

const amino_acids = [
    'R',
    'K',
    'H',
    'D',
    'E',
    'Q',
    'N',
    'S',
    'T',
    'Y',
    'W',
    'F',
    'A',
    'I',
    'L',
    'M',
    'V',
    'G',
    'P',
    'C',
];

const svgContainer = ref(null);
const currentIndex = ref(4);

const wildtypetextsize = '14px';
const ticktextsize = '14px';
const axisTitleSize = '16px';
const colorofmissing = 'lightgray';
const easingRef = 'easePolyInOut';
const delayByIndex = 5;
const sitesPerView = 20;
const minColor = -4;
const maxColor = 4;


let intervalId;
let svg;
let allSites;
let totalPages;

const { data } = useFetch(
    'https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/public_filtered/RBP_mutation_effects_bEFNB2_binding.csv'
);

const height = 400;
const margin = { top: 10, right: 30, bottom: 100, left: 50 };
const innerHeight = height - margin.top - margin.bottom;
const squareSize = Math.min(innerHeight / amino_acids.length, 20); // Define the square size based on the height and number of amino acids
const innerWidth = squareSize * sitesPerView; // Define the inner width based on the square size and number of visible sites
const width = innerWidth + margin.left + margin.right; // Define the total width based on the inner width and margins

//Setup holders for processed data
let dataLookup = {};
let wildtypeLookup = {};
let allCombinationsLookup = {};

//Once data is fetched, process data and run the updateHeatmap function
watch(data, () => {
    // Get all unique sites
    allSites = Array.from(new Set(data.value.map((d) => +d.site)));

    // Precompute all combinations for each site
    allCombinationsLookup = allSites.reduce((lookup, site) => {
        lookup[site] = amino_acids.map((mutant) => ({ site, mutant }));
        return lookup;
    }, {});

    // Calculate total number of pages
    totalPages = Math.ceil(allSites.length / sitesPerView);

    // Create dataLookup and wildtypeLookup once
    dataLookup = data.value.reduce((lookup, dataPoint) => {
        lookup[`${dataPoint.site}-${dataPoint.mutant}`] = dataPoint;
        return lookup;
    }, {});

    wildtypeLookup = data.value.reduce((lookup, dataPoint) => {
        lookup[dataPoint.site] = dataPoint.wildtype;
        return lookup;
    }, {});

    updateHeatmap();
});

//Get fill color for each heatmap square
function getFillColor(site, mutant) {
    const key = `${site}-${mutant}`;
    if (dataLookup[key]) {
        return colorScale(+dataLookup[key].bEFNB2_binding);
    } else {
        return wildtypeLookup[site] === mutant ? 'white' : colorofmissing;
    }
}

// Which sites are in current window?
const sitesInWindow = computed(() => {
    return allSites.slice(currentIndex.value * sitesPerView, (currentIndex.value + 1) * sitesPerView);
});

// Get all combinations for sites in window
const allCombinations = computed(() => {
    return sitesInWindow.value.flatMap((site) => allCombinationsLookup[site]);
});

// Get unique wildtypes for sites in window
const uniqueWildtypes = computed(() => {
    const wildtypesMap = new Map();
    sitesInView.value.forEach((d) => {
        if (!wildtypesMap.has(+d.site)) {
            wildtypesMap.set(+d.site, d);
        }
    });
    return Array.from(wildtypesMap.values());
});

// Make array with data for current sites in view
const sitesInView = computed(() => {
    return data.value.filter((d) => sitesInWindow.value.includes(+d.site));
});

// Create color scale
const colorScale = d3.scaleDiverging(d3.interpolateRdBu).domain([minColor, 0, maxColor]);

// Create scales
const xScale = computed(() => {
    return d3.scaleBand().domain(sitesInWindow.value).range([0, innerWidth]).padding(0.1);
});

const yScale = d3.scaleBand().domain(amino_acids).range([0, innerHeight]).padding(0.1);

onMounted(() => {
    //make svg container
    svg = d3
        .select(svgContainer.value)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //setup ticks for x-axis
    svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${innerHeight})`);

    //make title for x-axis
    svg.append('g').call((d) =>
        d
            .append('text')
            .attr('x', innerWidth / 2)
            .attr('y', height - margin.bottom + 50)
            .attr('text-anchor', 'end')
            .attr('fill', 'currentColor')
            .attr('font-weight', 'bold')
            .attr('font-size', axisTitleSize)
            .text('Site')
    );

    // Create the y-axis group and store it in a variable
    const yAxisGroup = svg.append('g').attr('class', 'y-axis')

    yAxisGroup
        .call(d3.axisLeft(yScale).tickSizeOuter(0))
        .attr('font-size', ticktextsize)
        .call((d) => d.select('.domain').remove())
        .call((d) =>
            d
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -innerHeight / 2)
                .attr('y', -margin.left + 15)
                //.attr('dy', '1em')
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .attr('fill', 'currentColor')
                .attr('font-size', axisTitleSize)
                .text('Amino Acid')
        );

    Legend(d3.scaleDiverging([minColor, 0, maxColor], d3.interpolateRdBu), {
        svgRef: svgContainer.value,
        title: 'Ephrin-B2 Binding',
        width: 100,
        tickValues: [minColor, 0, maxColor],
        xcoord: innerWidth - 50,
        ycoord: innerHeight + 60,
        fontSize: 16,
    });
});

function updateHeatmap() {
    intervalId = currentIndex.value = (currentIndex.value + 1) % totalPages;

    const gx = svg
        .select('.x-axis')
        .call(d3.axisBottom(xScale.value).tickSizeOuter(0))
        .attr('transform', `translate(1000,${innerHeight})`)
        .call((d) => d.select('.domain').remove());

    gx.transition()
        .duration(1500)
        .delay((d, i) => i * delayByIndex * Math.random())
        .ease(d3[easingRef])
        .ease(d3.easeCubicInOut)
        .attr('transform', `translate(0,${innerHeight})`)
        .selectAll('text')
        .attr('transform', 'rotate(-90)')
        .attr('font-size', ticktextsize)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .attr('dy', '-0.7em')
        .attr('dx', '-0.7em');

    svg
        .selectAll('rect')
        .data(allCombinations.value, (d) => `${d.site}-${d.mutant}`)
        .join(
            (enter) =>
                enter
                    .append('rect')
                    .attr('fill', (d) => getFillColor(d.site, d.mutant))
                    .attr('opacity', 0)
                    .attr('x', width)
                    .attr('y', (d) => yScale(d.mutant))
                    .attr('width', xScale.value.bandwidth())
                    .attr('height', yScale.bandwidth())
                    .transition()
                    .duration(1500)
                    .delay((d, i) => i * delayByIndex * Math.random())
                    .ease(d3[easingRef])
                    .attr('x', (d) => xScale.value(d.site))
                    .attr('opacity', 1),
            (update) => update,
            (exit) => exit
                .transition()
                .duration(500)
                .attr('opacity', 0)
                .remove());

    svg
        .selectAll('.wildtype')
        .data(Array.from(uniqueWildtypes.value.values()), (d) => d.site)
        .join(
            (enter) =>
                enter
                    .append('text')
                    .attr('class', 'wildtype')
                    .attr('x', (d) => xScale.value(+d.site) + xScale.value.bandwidth() * 10)
                    .attr('y', (d) => yScale(d.wildtype) + yScale.bandwidth() / 2)
                    .attr('text-anchor', 'middle')
                    .attr('opacity', 0)
                    .attr('dominant-baseline', 'middle')
                    .attr('dy', '0.1em')
                    .attr('font-size', wildtypetextsize)
                    .attr('font-weight', 300)
                    .text('X')
                    .transition()
                    .duration(1500)
                    .delay((d, i) => i * delayByIndex * Math.random())
                    .ease(d3[easingRef])
                    .attr('x', (d) => xScale.value(+d.site) + xScale.value.bandwidth() / 2)
                    .attr('fill', 'black')
                    .attr('opacity', 1),
            (update) => update,
            (exit) => exit
                .transition()
                .duration(500)
                .attr('opacity', 0)
                .remove());

    setTimeout(() => {
        updateHeatmap();
    }, 7500);
}

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>
