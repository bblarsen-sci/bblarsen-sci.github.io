<template>
  <div class="">
    <svg viewBox="0 0 600 600" ref="svgContainer" class=""> ></svg>
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
          r.branchLength = parseFloat(n);
        }
    }
  }
  return r;
}

function projection(d) {
        return [parseInt(d.y), parseInt(d.x)];
}

function diagonal(diagonalPath, i) {
        var source = diagonalPath.source,
            target = diagonalPath.target,
            pathData = [source, {x: target.x, y: source.y}, target];
            pathData = pathData.map(projection);

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

    var rootDists = nodes.map(function(n) { 
      return n.rootDist; 
    });

    var yscale = d3.scaleLinear()
      .domain([0, d3.max(rootDists)])
      .range([0, w]);

    visitPreOrder(nodes[0], function(node) {
      node.y = yscale(node.rootDist);
    });
    return yscale
}


function drawChart(data) {
  var margin = { top: 20, right: 10, bottom: 20, left: 10 };
  var width = 600 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;
  
  //SETUP TREE
  const root = d3.hierarchy(data, d => d.branchset)
    .sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id))
    .sum((d) => d.branchLength || 0);
    
  const tree = d3.cluster()
    .size([height , width ])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    })
  
  //SETUP COLOR SCALE OF LEAVES
  const countries = Array.from(new Set(root.descendants().map(d => d.data.country))).filter(Boolean);
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(countries);
  
  //ROOT TO GET X,Y POSITIONS, THEN SCALE BRANCH LENGTHS
  tree(root); 
  scaleBranchLengths(root.descendants(), width)

  //DRAW SVG
  const svg = d3.select(svgContainer.value).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  //DRAW LINKS
  svg.selectAll(".link")
    .data(root.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-width", 1.25)
    .join("path")
    .attr("d", diagonal)

  //DRAW NODES
  var node = svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  //DRAW CIRCLES
  node.filter(".node--leaf")
    .append("circle")
    .attr("r", 3)
    .attr("stroke", "currentColor")
    .attr("stroke-width", 1.5)
    .attr("fill", d => colorScale(d.data.country));

//  //MAKE LEGEND
//  const legend = svg.append("g")
//    .attr("class", "legend")
//    .attr("transform", `translate(${margin.left + 125}, ${margin.top})`);
//
//  // ADD LEGEND OPTIONS
//  const legendItems = legend.selectAll(".legend-item")
//    .data(countries)
//    .enter()
//    .append("g")
//    .attr("class", "legend-item")
//    .attr("transform", (d, i) => `translate(0, ${i * 20})`);
//
//  // Add circles to legend items
//  legendItems.append("circle")
//    .attr("r", 5)
//    .attr("class", "legendcircle")
//    .attr("stroke", "currentColor") 
//    .attr("stroke-width", 2)
//    .attr("fill", d => colorScale(d))
//
//  // Add country labels to legend items
//  legendItems.append("text")
//    .attr("class", "legend-text")
//    .attr("x", 8)
//    .style("fill","currentColor")
//    .attr("font-size", "12px")
//    .attr("y", 4)
//    .attr("dy", "0em")
//    .text(d => d);
}

async function fetchData() {
  try {
  const file = await fetch('/data/nipah_whole_genome_phylo.tre');
  const csv = await file.text();
  const parsedData = parseNewick(csv); 
  drawChart(parsedData); 
  } catch (error) {
    console.error('Error in fetchData:', error);
  }
};
onMounted(() => {
  fetchData();
});
</script>

<style>

</style>
