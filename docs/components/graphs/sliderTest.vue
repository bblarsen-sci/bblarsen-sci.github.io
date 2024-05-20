<template>
  <div class="container mx-auto max-w-screen-lg">
    <div class="flex flex-wrap gap-4 justify-evenly pb-10">
      <div v-for="(slider, index) in sliders" :key="index">
        <h3>{{ slider.label }}: {{ slider.value }}</h3>
        <CustomSlider :min="slider.min" :max="slider.max" v-model="slider.value" />
      </div>
    </div>
    <D3PlotContainer>
      <div ref="svgContainer"></div>
    </D3PlotContainer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as d3 from 'd3';
import CustomSlider from "/components/layouts/CustomSlider.vue";

// DEFINE VARIABLES
const svgContainer = ref(null);
let circle = null;

// DEFINE D3 FUNCTIONS
const height = 100;
const width = 300;
const margin = { top: 10, right: 20, bottom: 30, left: 30 };

const sliders = ref([
  { label: 'Radius', value: 10, min: 5, max: 50 },
  { label: 'X-Axis', value: (width - margin.left - margin.right) / 2, min: 0, max: 250 },
  { label: 'Y-Axis', value: (height - margin.top - margin.bottom) / 2, min: 0, max: height - margin.top - margin.bottom },
]);

onMounted(() => {
  const svgElement = d3.select(svgContainer.value).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  circle = svgElement.append('g')
    .append('circle')
    .attr('cx', sliders.value[1].value)
    .attr('cy', sliders.value[2].value)
    .attr('r', sliders.value[0].value)
    .attr('fill', 'steelblue');
});

sliders.value.forEach((slider, index) => {
  watch(() => slider.value, (newValue) => {
    if (circle) {
      switch (index) {
        case 0:
          circle.attr('r', newValue);
          break;
        case 1:
          circle.attr('cx', newValue);
          break;
        case 2:
          circle.attr('cy', newValue);
          break;
      }
    }
  });
});
</script>

<style scoped>
</style>
