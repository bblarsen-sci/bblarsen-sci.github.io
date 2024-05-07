<template>
  <div class="flex flex-col justify-center items-center ">
    <div class="" ref="svgContainer"></div>
  </div>
</template>

<script setup>
import * as d3 from 'd3'; 
import { onMounted, ref } from 'vue';

const svgContainer = ref(null);

function parseNewick(a) {
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
  const nameAndCountry = n.split(/\[|\]/);
  r.name = nameAndCountry[0];
  r.country = nameAndCountry[1]; // Extract the country information
} else if (h === ":") {
  r.length = parseFloat(n);
}
    }
  }
  return r;
};

function maxLength(d) {
  return d.data.length + (d.children ? d3.max(d.children, maxLength) : 0);
}
function drawChart(data) {
  const height = 600;
  const width = 600;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const outerRadius = width / 2;
  const innerRadius = outerRadius - 120;
  
  const tree = d3.tree()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right])

  const root = d3.hierarchy(data, d => d.branchset)
      //.sum(d => d.branchset )
      .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id));
        
  const cluster = d3.cluster()
    .size([width-margin.left - margin.right, height-margin.top - margin.bottom])
  


  // Make svg elements
  const svg = d3.select(svgContainer.value);
  svg.selectAll("*").remove();
  
  const svgElement = svg.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // Initialize SVG properly
  const g = svgElement.append("g")
    .attr("transform", `translate(0, ${root.dy})`);
  
  
    var link = g.selectAll(".link")
    .data(tree(root).links())
    .enter().append("path")
      .attr("class", "link")
	  .attr("fill","none")
	  .attr("stroke","#ccc")
    .attr("stroke-width", 2)
      .attr("d", d3.linkRadial()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; }));

  const node = svgElement.selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append('circle')
    .attr('r', 2.5)
    .attr('stroke', 'indianred')
    .attr('stroke-width', 2)
    .attr('fill', 'white');
}

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedData = parseNewick(csv); 
  drawChart(parsedData); 
};
onMounted(() => {
  fetchData();
});
</script>

<style>
</style>
