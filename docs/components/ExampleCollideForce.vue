<script setup>
import * as d3 from "d3";
import { ref, onMounted, onUnmounted, watch } from "vue";

const width = 688;
const height = 540;
const k = width / 200;
const r = d3.randomUniform(k, k * 4);
const nodes = Array.from({length: 200}, () => ({r: r()}));
let simulation;

// Reactive properties
const container = ref(null);
const currentColor = ref("fill-slate-500"); // Default color

onMounted(() => {
  const svg = d3.select(container.value)
      .on("touchmove", (event) => event.preventDefault())
      .on("pointerenter", () => simulation.alphaTarget(0.3).restart())
      .on("pointerleave", () => simulation.alphaTarget(0))
      .on("pointermove", (event) => ([nodes[0].fx, nodes[0].fy] = d3.pointer(event)));

  const circle = svg.selectChildren()
    .data(nodes.slice(1))
    .join("circle")
      .attr("r", (d) => d.r)
      .classed(currentColor.value, true); // Apply initial color

  simulation = d3.forceSimulation(nodes)
      .velocityDecay(0.5) // low friction
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force("collide", d3.forceCollide().radius((d) => d.r + 1).iterations(4))
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
      .on("tick", () => {
        circle.attr("cx", (d) => d.x)
              .attr("cy", (d) => d.y);
      });

  watch(currentColor, (newColor, oldColor) => {
    circle.classed(oldColor, false).classed(newColor, true);
  });
});

onUnmounted(() => {
  simulation?.stop();
});
</script>

<template>
  <div style="margin: 1em 0;">
    <div class="flex justify-center items-center space-x-4">
      <label for="color-select">Choose a color:</label>
      <select id="color-select" class="rounded border-gray-300" v-model="currentColor">
        <option value="fill-slate-500">Gray</option>
        <option value="fill-red-500">Red</option>
        <option value="fill-blue-500">Blue</option>
        <option value="fill-green-500">Green</option>
        <option value="fill-yellow-500">Yellow</option>
        <option value="fill-purple-500">Purple</option>
      </select>
    </div>
    <svg :width="width" :height="height" :viewBox="[-width / 2, -height / 2, width, height].join(' ')" class="bg-slate-100" ref="container"></svg>
  </div>
</template>

<style scoped>
/* Add custom styles here */
</style>
