<template>
    <div ref="chart"></div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'BarChart',
    props: {
      data: Array
    },
    mounted() {
      this.createChart();
    },
    watch: {
      data: {
        handler(newData) {
          this.updateChart(newData);
        },
        deep: true
      }
    },
    methods: {
      createChart() {
        const svg = d3.select(this.$refs.chart)
                      .append('svg')
                      .attr('width', 400)
                      .attr('height', 300);
        
        svg.selectAll('rect')
           .data(this.data)
           .enter()
           .append('rect')
           .attr('x', (d, i) => i * 45)
           .attr('y', d => 300 - 10 * d)
           .attr('width', 40)
           .attr('height', d => d * 10)
           .attr('fill', 'teal');
      },
      updateChart(data) {
        const svg = d3.select(this.$refs.chart).select('svg');
  
        const rects = svg.selectAll('rect').data(data);
        
        rects.enter()
             .append('rect')
             .merge(rects)
             .attr('x', (d, i) => i * 45)
             .attr('y', d => 300 - 10 * d)
             .attr('width', 40)
             .attr('height', d => d * 10)
             .attr('fill', 'teal');
  
        rects.exit().remove();
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any specific styles for your chart container or SVG here */
  </style>
  