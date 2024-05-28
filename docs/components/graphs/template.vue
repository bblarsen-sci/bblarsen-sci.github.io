<template>
  <div ref="bigContainer" class="container h-screen w-full mx-auto">
    <div xmlns="http://www.w3.org/2000/svg" ref="svgContainer"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watchEffect, nextTick, watch } from 'vue';
  import * as d3 from 'd3';
  import { useResizeObserver } from '@vueuse/core';

  //refs
  const svgContainer = ref(null);
  const bigContainer = ref(null);

  //dimensions
  const dimensions = ref({
    width: 0,
    height: 0,
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
    console.log('width', width, 'height', height)
    dimensions.value.width = width * 0.8;
    dimensions.value.height = height * 0.8;
  });

  //watch for changes in dimensions
  watch(
    () => [dimensions.value.width, dimensions.value.height],
    () => {
      makePlot();
    },
  )

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

    //set dimensions
    const innerWidth = dimensions.value.width - dimensions.value.margin.left - dimensions.value.margin.right;
    const innerHeight = dimensions.value.height - dimensions.value.margin.top - dimensions.value.margin.bottom;
    
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

    //create x scale
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, innerWidth])
      .nice();

    //create y scale
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, yAccessor))
      .range([innerHeight, 0])
      .nice();

    //create circles
    bounds.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(xAccessor(d)))
      .attr('cy', (d) => yScale(yAccessor(d)))
      .attr('r', 10)
      .attr('fill', (d) => colorScale(colorAccessor(d)));

    //create y axis
    const yAxisGenerator = d3.axisLeft().scale(yScale);
    const yAxis = bounds.append('g').call(yAxisGenerator);

    //create x axis
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
      .append('g')
      .call(xAxisGenerator)
      .attr('transform', `translate(0, ${innerHeight})`);

    //create x axis label
    const xAxisLabel = xAxis
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', dimensions.value.margin.bottom - 10)
      .attr('fill', 'black')
      .style('font-size', '1.4em')
      .html('Dew point (&deg;F)');

      const yAxisLabel = yAxis
      .append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -dimensions.value.margin.left + 10)
      .attr('transform', 'rotate(-90)')
      .attr('fill', 'black')
      .style('font-size', '1.4em')
      .html('Temp (&deg;F)');
  }
</script>

<style scoped>
</style>