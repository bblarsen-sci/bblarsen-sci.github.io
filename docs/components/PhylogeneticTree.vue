<template>
    <div ref="svgContainer"></div>
</template>

<script>
import * as d3 from 'd3'; 

export default {
  name: 'TreeVisualization',
  data() {
    return {
      dataset: [],
      treeData: null,  // Store the parsed tree data here
    };
  },
  mounted() {
    this.loadTreeData();
  },
  methods: {
    parseNewick(a) {
      for (var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0; t < s.length; t++) {
        var n = s[t];
        switch (n) {
          case "(":
            var c = {};
            r.branchset = [c];
            e.push(r);
            r = c;
            break;
          case ",":
            var c = {};
            e[e.length - 1].branchset.push(c);
            r = c;
            break;
          case ")":
            r = e.pop();
            break;
          case ":":
            break;
          default:
            var h = s[t - 1];
            if (h === ")" || h === "(" || h === ",") {
              r.name = n;
            } else if (h === ":") {
              r.length = parseFloat(n);
            }
        }
      }
      return r;
    },
    
    async loadTreeData() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/dms-vep/Nipah_Malaysia_RBP_DMS/master/data/custom_analyses_data/alignments/phylo/nipah_whole_genome_phylo.tre');
        const data = await response.text();
        const parsedData = this.parseNewick(data);
        this.treeData = parsedData;  // Store the parsed data in treeData
        this.drawChart(this.treeData);  // Pass the data to drawChart
      } catch (error) {
        console.error('Error loading tree data:', error);
      }
    },
    drawChart(parsedData) {
    const width = 954;
    const outerRadius = width / 2;
    const innerRadius = outerRadius - 170;
    const root = d3.hierarchy(parsedData, d => d.branchset)
        .sum(d => d.branchset ? 0 : 1)
        .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.length, b.data.length));
    
    console.log(root);
    const cluster = d3.cluster()
        .size([360, innerRadius])
        .separation((a, b) => 1);
    
    console.log(cluster);

    function maxLength(d) {
        return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
    }
    console.log(d3.max(root.children, maxLength));
    function setRadius(d, y0, k) {
        d.radius = (y0 += d.data.length) * k;
        if (d.children) d.children.forEach(d => setRadius(d, y0, k));
    }

    function linkStep(startAngle, startRadius, endAngle, endRadius) {
        const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
        const s0 = Math.sin(startAngle);
        const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
        const s1 = Math.sin(endAngle);
        return "M" + startRadius * c0 + "," + startRadius * s0
            + (endAngle === startAngle ? "" : "A" + startRadius + "," + startRadius + " 0 0 " + (endAngle > startAngle ? 1 : 0) + " " + startRadius * c1 + "," + startRadius * s1)
            + "L" + endRadius * c1 + "," + endRadius * s1;
    }

    cluster(root);
    setRadius(root, root.data.length = 0, innerRadius / maxLength(root));
    
    // Initialize SVG properly
    const svg = d3.select(this.$refs.svgContainer)
        .append('svg')
        .attr('width', width)
        .attr('height', width)
        .attr("viewBox", [-outerRadius, -outerRadius, width, width])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const linkExtension = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.25)
        .selectAll("path")
        .data(root.links().filter(d => !d.target.children))
        .join("path")
        .attr("d", linkStep);

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", linkStep);

    svg.append("g")
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("dy", ".31em")
        .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius + 4},0)${d.x < 180 ? "" : " rotate(180)"}`)
        .attr("text-anchor", d => d.x < 180 ? "start" : "end")
        .text(d => d.data.name.replace(/_/g, " "));
}
  }
};
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
