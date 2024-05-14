<template>
  <div class="container mx-auto">
    <div ref="svgContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as d3 from 'd3';

const dataset = ref([5, 10, 15, 20, 25, 30]);
const svgContainer = ref(null);

onMounted(() => {
  const svg = d3.select(svgContainer.value); // Select the SVG container

  // Append a new SVG element to the container
  const svgElement = svg.append('svg')
    .attr('width', 600)
    .attr('height', 150);

  // Function to update the circles
  const updateCircles = () => {
    svgElement.selectAll('circle')
      .data(dataset.value)
      .join(
        enter => (
          enter.append("circle")
            .attr("cx", d => d * 15 + 10)
            .attr("cy", 0)
            .attr("r", 0)
            .attr("fill", "cornflowerblue")
            .call(enter => (
              enter.transition().duration(1200)
                .attr("cy", 50)
                .attr("r", 20)
                .style("opacity", 1)
            ))
        ),
        update => (
          update.attr("fill", "lightgrey")
        ),
        exit => (
          exit.attr("fill", "tomato")
            .call(exit => (
              exit.transition().duration(1200)
                .attr("r", 0)
                .style("opacity", 0)
                .remove()
            ))
        ),
      );
  };

  // Call the updateCircles function initially
  updateCircles();

  // Update the dataset every 2 seconds
  setInterval(() => {
    dataset.value = Array.from({ length: 6 }, () => Math.floor(Math.random() * 30) + 5);
  }, 2000);
});
</script>