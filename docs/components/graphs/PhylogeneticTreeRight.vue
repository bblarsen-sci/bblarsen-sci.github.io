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
        // draw the hooked paths between nodes
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
      if (node.branchLength < 0) node.branchLength = -1 * node.branchLength;
      node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.branchLength || 0)
    });

    var rootDists = nodes.map(function(n) { 
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


function drawChart(data) {
  console.log('data', data);
  var margin = { top: 20, right: 10, bottom: 20, left: 10 };
  var width = 500 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;


  var root = d3.hierarchy(data, d => d.branchset)
    //.sort((a, b) => b.height - a.height || d3.ascending(a.id, b.id));


  var tree = d3.cluster()
    .size([height, width])
    .separation(function separation(a, b) {
      return a.parent == b.parent ? 1 : 1;
    })
    
  
  var nodes = tree(root);
  console.log('nodes', nodes);


  var svg = d3.select(svgContainer.value).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll(".link")
    .data(nodes.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2)
    .attr("d", diagonal)

  var node = svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { return "translate(" + (d.y) + "," + d.x + ")"; });


  node.append("circle")
    .attr("r", 2.5)
    .attr("stroke", "indianred")
    .attr("stroke-width", 2)
    .attr("fill", "white");

  
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
