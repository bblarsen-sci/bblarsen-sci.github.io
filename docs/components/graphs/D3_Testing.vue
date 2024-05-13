<template>
  <div class="container mx-auto">
      <div ref="svgContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import * as d3 from 'd3';

const arraysize = ref(20);
const dataset = ref([5,10,15,20,25]);
const svgContainer = ref(null);

let svg;
let svgElement;


onMounted(() => {
  svg = d3.select(svgContainer.value); // Select the SVG container
  
  // Append a new SVG element to the container
  svgElement = svg.append('svg')
    .attr('width', 600)
    .attr('height', 150)

  // Bind data and append circles
  const circles = svgElement.selectAll('circle')
    .data(dataset.value)
    .join(
        enter => (
          enter.append("circle")
              .attr("cx", d => d * 15 + 10)
              .attr("cy", 10)
              .attr("r", 0)
              .attr("fill", "cornflowerblue")
            .call(enter => (
              enter.transition().duration(1200)
                .attr("cy", 10)
                .attr("r", 6)
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
      )
    
    

//setInterval(() => {
//  const newDataset = generateDataset();
//  dataset.value = newDataset;
//
//  // Update the circle positions and radius
//  circles.data(dataset.value)
//    .attr('cx', d => d[0])
//    .attr('cy', d => d[1])
//    .attr('r', 3);
//}, 1000);
});
</script>