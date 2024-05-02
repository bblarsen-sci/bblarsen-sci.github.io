<template>
  <div class="flex flex-col justify-center items-center">
    <div ref="svgContainer"></div>
  </div>
</template>




<script>
import * as d3 from 'd3';

export default {
  name: 'MeanEffectPlot',
  data() {
    return {
      dataset: []
    };
  },
  mounted() {
    this.loadCsvData();
  },
  methods: {
    loadCsvData() {
      d3.csv('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/results/filtered_data/entry/e2_e3_entry_filter_concat.csv').then(data => {
        this.dataset = data;
        this.createChart();
      }).catch(error => {
        console.error('Error loading the CSV file: ', error);
      });
    },
    createChart() {
      // Setup the dimensions of the chart
      const width = 640;
      const height = 400;
      const marginTop = 50;
      const marginRight = 50;
      const marginBottom = 60;
      const marginLeft = 60;
      
      // Main SVG element
      const svg = d3.select(this.$refs.svgContainer)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .attr("viewBox", [0, 0, width, height])

      // Group data by site and calculate mean effect
      const dataBySite = d3.group(this.dataset, d => d.site);
      const meanEffects = Array.from(dataBySite, ([site, effects]) => ({
        site: parseInt(site),
        meanEffect: d3.mean(effects, d => parseFloat(d.effect))
      }));

      // Scale setup
      const x = d3.scaleLinear()
        .domain([d3.min(meanEffects, d => d.site), d3.max(meanEffects, d => d.site)])
        .range([marginLeft, width - marginRight]);
          

      const y = d3.scaleLinear()
          .domain([d3.min(meanEffects, d => d.meanEffect), d3.max(meanEffects, d => d.meanEffect)])
          .range([height - marginBottom, marginTop]);

      // Add x-axis
      svg.append('g')
          .attr('transform', `translate(0,${height - marginBottom})`)
          .call(d3.axisBottom(x).tickFormat(d3.format('d')))
          .style('font-size', '14px')
          .call((g) => g.append("text")
                .attr("x", width / 2)
                .attr("y", marginBottom - 15)
                .attr("fill", "currentColor")
                .attr("text-anchor", "middle")
                .text("Site")
                .style("font-size", "16px"));

      // Add y-axis
      svg.append('g')
          .attr("transform", `translate(${marginLeft},0)`)
          .call(d3.axisLeft(y))
          .style('font-size', '14px')
          .call((g) => g.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -marginLeft + 15)
                .attr("fill", "currentColor")
                .attr("text-anchor", "middle")
                .text("Mean Effect")
                .style("font-size", "16px"));

      // Plot mean effects as circles
      svg.selectAll(".mean-effect-dot")
          .data(meanEffects)
          .enter().append("circle")
          .attr("class", "mean-effect-dot")
          .attr("cx", d => x(d.site))
          .attr("cy", d => y(d.meanEffect))
          .attr("r", 3)
          .attr("fill", "currentColor")
    }
  }
};
</script>
  
