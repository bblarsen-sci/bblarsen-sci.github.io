<template>
  <div class="flex flex-wrap justify-evenly gap-4 border-0 pb-10">
    <div v-for="(slider, index) in sliders" :key="index">
      <p>{{ slider.label }}: {{ slider.value }}</p>
      <CustomSlider :min="slider.min" :max="slider.max" :step="slider.step" v-model="slider.value" />
    </div>
  </div>
  <svg ref="svgContainer"></svg>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import * as d3 from 'd3';
import CustomSlider from '/components/components/CustomSlider.vue';

// DEFINE VARIABLES
let circle = null;
const svgContainer = ref(null);

// DEFINE D3 FUNCTIONS
const height = 100;
const width = 300;
const margin = { top: 10, right: 20, bottom: 30, left: 30 };
const colorInterpolation = d3.interpolateViridis;

const sliders = ref([
  { label: 'Radius', value: 10, min: 5, max: 50 },
  { label: 'X-Axis', value: (width - margin.left - margin.right) / 2, min: 0, max: 250 },
  {
    label: 'Y-Axis',
    value: (height - margin.top - margin.bottom) / 2,
    min: 0,
    max: height - margin.top - margin.bottom,
  },
  { label: 'Color', value: 0, min: 0, max: 1, step: 0.01 },
]);

onMounted(() => {
  const svgElement = d3
    .select(svgContainer.value)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  circle = svgElement
    .append('g')
    .append('circle');

  watchEffect(() => {
    circle
      .attr('cx', sliders.value[1].value)
      .attr('cy', sliders.value[2].value)
      .attr('r', sliders.value[0].value)
      .attr('fill', colorInterpolation(sliders.value[3].value));
  });
});
</script>