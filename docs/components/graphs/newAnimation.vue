<template>
  <div ref="svgContainer"></div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import * as d3 from 'd3';

  const svgContainer = ref(null);

  const width = 100;
  const height = 50;
  const marginTop = 10;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;

  // Generate initial data points
  const x = d3.scaleLinear().domain([]).range([marginLeft, width - marginRight]);
  const y = d3.scaleLinear().domain([]).range([height - marginBottom, marginTop]);

  const generateDataset = () => (
    Array(10).fill(0).map(() => ([
      Math.random() * 80 + 10,
      Math.random() * 15 + 5,
    ]))
  )

  // Create the SVG element
  function createSvg() {
    const svg = d3
      .select(svgContainer.value)
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', [0, 0, width, height])
      .append('g')
      .attr('transform', `translate(0,${marginTop})`);

    return svg;
  }

  onMounted(() => {
    const svg = createSvg();
    update(svg)
    setInterval(() => { update(svg) }, 2000);
  });
  function update(svg) {

    const data = generateDataset();
    svg.selectAll("circle")
      .data(data)
      .join(
        enter => enter.append("circle")
          .attr("cx", d => d[0])
          .attr("cy", d => d[1])
          .attr("r", 2.5)
          .attr('fill', function (d) {
            return d[0] > 50 ? 'steelblue' : 'indianred';
          }),
        update => update
          .attr('stroke', 'currentColor')
          .attr('stroke-width', 0.5)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("cx", d => d[0])
          .attr("cy", d => d[1])
          .attr('fill', function (d) {
            return d[0] > 50 ? 'steelblue' : 'indianred';
          }),
        exit => exit
          .transition()
          .duration(500)
          .attr("r", 0)
          .remove()

      )

  }
</script>