<template>
    <div>
      <select v-model="selectedDataset" @change="updateChart" 
          class=" bg-blue-500 text-white px-6 py-4 rounded cursor-pointer focus:outline-none hover:bg-red-600">
        <option value="dataset1">Dataset 1</option>
        <option value="dataset2">Dataset 2</option>
      </select>
      <div ref="d3Container"></div>
    </div>
</template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'DynamicD3Chart',
    data() {
      return {
        selectedDataset: 'dataset1',
        datasets: {
          dataset1: [10, 15, 20, 25, 30],
          dataset2: [30, 25, 20, 15, 10]
        }
      };
    },
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        const width = 500, height = 300, margin = 40;
        const svg = d3.select(this.$refs.d3Container)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('background-color', '#f4f4f4');
  
        svg.selectAll('rect')
          .data(this.datasets[this.selectedDataset])
          .enter()
          .append('rect')
          .attr('x', (d, i) => i * 100 + margin)
          .attr('y', d => height - d * 5)
          .attr('width', 50)
          .attr('height', d => d * 5)
          .attr('fill', 'steelblue');
  
        this.svg = svg; // Store the SVG element for updates
      },
      updateChart() {
        this.svg.selectAll('rect')
          .data(this.datasets[this.selectedDataset])
          .transition() // D3 transition for animation
          .duration(750) // Animation duration 750ms
          .attr('y', d => 300 - d * 5)
          .attr('height', d => d * 5);
      }
    }
  }
  </script>
  