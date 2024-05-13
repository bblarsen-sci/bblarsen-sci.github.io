<template>
  <div class="container mx-auto border-2 text-xs font-roboto">
    <button @click="scaled = !scaled">Toggle Scaling</button>
    <div ref="svgContainer" class=""></div>
  </div>
</template>

<script setup>
import * as d3 from 'd3'; 
import { onMounted, ref, computed, watch} from 'vue';

const svgContainer = ref(null);
const data = ref(null);
const scaled = ref(true);

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
          r.branchLength = parseFloat(n);
        }
    }
  }
  return r;
}

function projection(d) {
  // reversed projection - horizontal tree instead of vertical
  return [parseInt(d.y), parseInt(d.x)];
}

function diagonal(diagonalPath, i) {
  var source = diagonalPath.source,
      target = diagonalPath.target,
      pathData = [source, {x: target.x, y: source.y}, target].map(projection);

  return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
}

function scaleBranchLengths(nodes, w) {
    function visitPreOrder(root, callback) {
      callback(root)
      if (root.children) {
        for (var i = root.children.length - 1; i >= 0; i--){
          visitPreOrder(root.children[i], callback)
        };
      }
    }
    visitPreOrder(nodes[0], function(node) {
      if (node.value < 0) node.value = -1 * node.value;
      node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.value || 0)
    });

    var rootDists = Array.from(nodes, function(n) { 
      return n.rootDist; 
    });

    var yscale = d3.scaleLinear()
      .domain([0, d3.max(rootDists)])
      .range([0, w]);

    visitPreOrder(nodes[0], function(node) {
      node.y = parseInt(yscale(node.rootDist));
    });
    return yscale
}

const root = computed(() =>
  d3.hierarchy(data.value, d => d.branchset)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id))
    .sum((d) => d.branchLength || 0)
);

const tree = computed(() =>
  d3.cluster()
    .size([height - margin.top - margin.bottom, width - margin.right - margin.left])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    })
);

const countries = computed(() =>
  Array.from(new Set(root.value.descendants().map(d => d.data.country))).filter(Boolean)
);

const colorScale = computed(() =>
  d3.scaleOrdinal()
  .domain(countries.value)
  .range(d3.schemeCategory10)
);

function setColor(d) {
  if (d.children) {
    const childColors = d.children.map(child => setColor(child));
    const uniqueColors = [...new Set(childColors)];
    d.color = uniqueColors.length === 1 ? uniqueColors[0] : '#ccc'; // Set gray color for mixed descendants
  } else {
    const country = d.data.country;
    d.color = colorScale.value.domain().indexOf(country) >= 0 ? colorScale.value(country) : null;
  }
  return d.color;
}

const legend = svg => {
  const g = svg
    .selectAll("g")
    .attr("class", "legend")
    .data(colorScale.value.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(${margin.left + 275}, ${i * 20})`);

  g.append("circle")
    .attr("class", "legendcircle")
    .attr("r", 5)
    .attr("stroke", "currentColor")
    .attr("fill", colorScale.value);
  
  g.append("text")
    .attr("class", "legend-text")
    .attr("x", 10)
    .attr("dy", "0.1em")
    .text(d => d);
}

watch (scaled, () => {
  drawChart();
});

const margin = {top: 20, right: 20, bottom: 20, left: 20};
const width = 800 
const height = 400

function drawChart() {
  d3.select(svgContainer.value).selectAll("*").remove();

  // ROOT TO GET X,Y POSITIONS
  tree.value(root.value);
  setColor(root.value);
  
  // SCALE BRANCH LENGTHS IF SCALED
  if (scaled.value) {
    scaleBranchLengths(root.value.descendants(), width);
  }

  //DRAW SVG
  var svg = d3.select(svgContainer.value).append("svg")
   .attr('width', '100%')
   .attr('height', 800)
   .attr('viewBox', [0, 0, width , height])
   .append("g")
   .attr("transform", `translate(${margin.left - 200}, ${margin.top})`);

  svg.append("g")
    .call(legend);

  //DRAW LINKS
  svg.append("g")
    .attr("class", "link")
    .selectAll("path")
    .data(root.value.links())
    .join("path")
    .attr("d", diagonal)
    .attr("stroke", d => d.target.color)

  //DRAW NODES
  svg.append("g")
    .selectAll("circle")
    .data(root.value.descendants().filter(d => !d.children))
    .join("circle")
    .attr("r", 3)
    .attr("stroke", "currentColor")
    .attr("fill", d => colorScale.value(d.data.country))
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
}

async function fetchData() {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedNewick = parseNewick(csv); 
  return parsedNewick;
};
onMounted(async() => {
  data.value = await fetchData();
  drawChart();
});
</script>

<style>
.legend-text {
  text-anchor: start;
  alignment-baseline: middle;
}
.legendcircle {
  stroke-width: 1;
}
.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1.5;
}
</style>