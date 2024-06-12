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
        bottom:60,
        left: 60,
    },
});

let wrapper;

//data
const data = [
    { x: 10, y: 20 },
    { x: 20, y: 10 },
    { x: 50, y: 70 },
    { x: 40, y: 85 },
    { x: 70, y: 80 },
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
        .range(['steelblue', 'indianred']);

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
        .attr('font-size', '14px')
        .attr('transform', `translate(0, ${innerHeight.value})`);

    //create x axis label
    xAxis
        .append('text')
        .attr('x', innerWidth.value / 2)
        .attr('y', dimensions.value.margin.bottom - 20)
        .attr('fill', 'currentColor')
        .style('font-size', '16px')
        .attr('font-weight', 'bold')
        .html('Dew point (&deg;F)');

    //create y axis
    const yAxisGenerator = d3.axisLeft().scale(yScale.value);
    const yAxis = bounds.append('g').call(yAxisGenerator).attr('font-size', '14px');

    yAxis
        .append('text')
        .attr('x', -innerHeight.value / 2)
        .attr('y', -dimensions.value.margin.left + 20)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'currentColor')
        .style('font-size', '16px')
        .attr('font-weight', 'bold')
        .html('Temp (&deg;F)');
}
</script>
