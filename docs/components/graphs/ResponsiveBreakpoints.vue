<template>
    <div ref="bigContainer" class="flex h-screen w-screen mx-auto">
        <div ref="svgContainer"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import * as d3 from 'd3';
import { useResizeObserver } from '@vueuse/core';

//refs
const svgContainer = ref(null);
const bigContainer = ref(null);

//dimensions
const dimensions = ref({
    width: 500,
    height: 500,
    margin: {
        top: 15,
        right: 15,
        bottom: 40,
        left: 40,
    },
});

let wrapper;

//data
const data = [
    { x: 10, y: 20 },
    { x: 40, y: 90 },
    { x: 80, y: 50 },
    { x: 160, y: 100 },
    { x: 200, y: 150 },
];

//watch for resize
useResizeObserver(bigContainer, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    dimensions.value.width = width * 0.7;
    dimensions.value.height = height * 0.7;
});

//watch for changes in dimensions
watch(
    () => [dimensions.value.width, dimensions.value.height],
    () => {
        makePlot();
    },
)

const innerHeight = computed(() => dimensions.value.height - dimensions.value.margin.top - dimensions.value.margin.bottom);

const innerWidth = computed(() => dimensions.value.width - dimensions.value.margin.left - dimensions.value.margin.right);

const xScale = computed(() => {
    return d3.scaleLinear().domain(d3.extent(data, (d) => d.x)).range([0, innerWidth.value]).nice();
});

const yScale = computed(() => {
    return d3.scaleLinear().domain(d3.extent(data, (d) => d.y)).range([innerHeight.value, 0]).nice();
});


//make plot once mounted
onMounted(() => {
    makePlot();
});

//create plot
function makePlot() {
    //check if data is available
    if (!data) {
        return;
    }

    //remove old plot
    if (wrapper !== undefined) {
        wrapper.remove();
    }

    //set accessors
    const xAccessor = (d) => d.x;
    const yAccessor = (d) => d.y;
    const colorAccessor = (d) => d.x;

    //set color scale
    const colorScale = d3
        .scaleLinear()
        .domain(d3.extent(data, colorAccessor))
        .range(['skyblue', 'darkslategrey']);

    //create svg
    wrapper = d3
        .select(svgContainer.value)
        .append('svg')
        .attr('width', dimensions.value.width)
        .attr('height', dimensions.value.height)

    //create bounds
    const bounds = wrapper
        .append('g')
        .attr('transform', `translate(${dimensions.value.margin.left}, ${dimensions.value.margin.top})`);

    //create circles
    bounds.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale.value(xAccessor(d)))
        .attr('cy', (d) => yScale.value(yAccessor(d)))
        .attr('r', 10)
        .attr('fill', (d) => colorScale(colorAccessor(d)));

    //create x axis
    const xAxisGenerator = d3.axisBottom().scale(xScale.value);
    const xAxis = bounds
        .append('g')
        .call(xAxisGenerator)
        .attr('transform', `translate(0, ${innerHeight.value})`);

    //create x axis label
    xAxis
        .append('text')
        .attr('x', innerWidth.value / 2)
        .attr('y', dimensions.value.margin.bottom - 10)
        .attr('fill', 'currentColor')
        .style('font-size', '1.4em')
        .html('Dew point (&deg;F)');

    //create y axis
    const yAxisGenerator = d3.axisLeft().scale(yScale.value);
    const yAxis = bounds.append('g').call(yAxisGenerator);

    yAxis
        .append('text')
        .attr('x', -innerHeight.value / 2)
        .attr('y', -dimensions.value.margin.left + 10)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'currentColor')
        .style('font-size', '1.4em')
        .html('Temp (&deg;F)');
}
</script>
