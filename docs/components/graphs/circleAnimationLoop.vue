<template>
    <div ref="svgContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const dataset = ref([10, 10, 10, 10, 10, 10]);
const svgContainer = ref(null);
const width = 500;
const height = 100;
const delay = 1000; // Delay in milliseconds


onMounted(() => {
  const svg = d3.select(svgContainer.value);
  const svgElement = svg.append('svg')
    .attr('viewBox', [0, 0, width, height]);

  function update() {
    let blue = svgElement.selectAll('.blue-circle').data(dataset.value, d => d);
    blue.join(
      enter => enter.append('circle')
        .attr('class', 'blue-circle')
        .attr('cx', (d, i) => i * 100 + 50)
        .attr('cy', height / 2)
        .attr('r', 0)
        .attr('fill', 'steelblue')
        .call(enter => enter.transition().delay(delay).duration(2000)
          .attr('r', (d, i) => d)
        ),
      update => update,
      exit => exit
        .call(exit => exit.transition().duration(2000)
          .attr('fill', 'indianred')
          .attr('r', 0)
          .remove()
        )
    )

  }

  update(); // Call update initially to render the circles

  setInterval(() => {
    dataset.value = [
      Math.random() * 30,
      Math.random() * 30,
      Math.random() * 30,
      Math.random() * 30,
      Math.random() * 30,
    ];
    update();
  }, 4000);
});
</script>